# app.py
from flask import Flask, request, jsonify
import os, subprocess, json
from flask_cors import CORS # Import CORS to allow cross-origin requests from your frontend
import pandas as pd
import joblib # Use joblib for loading the trained model

from Bio import SeqIO  

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# Initialize the Flask application
CORS(app) # Enable CORS for all routes

try:
    model_pipeline = joblib.load("xgboost_genetic_model.pkl")
    print("✅ Model loaded successfully.")
except FileNotFoundError:
    print("❌ Error: 'xgboost_genetic_model.pkl' not found.")
    model_pipeline = None

# ------------------------------
# File Parsers
# ------------------------------
def parse_fasta(filepath):
    seqs = [str(rec.seq) for rec in SeqIO.parse(filepath, "fasta")]
    concatenated = "".join(seqs)
    return {
        "length": len(concatenated),
        "gc_content": (concatenated.count("G") + concatenated.count("C")) / max(len(concatenated), 1),
    }

def parse_vcf(filepath):
    # Very simple feature extractor example
    variants = 0
    with open(filepath) as f:
        for line in f:
            if not line.startswith("#"):
                variants += 1
    return {"variant_count": variants}

def parse_gff(filepath):
    features = 0
    with open(filepath) as f:
        for line in f:
            if not line.startswith("#"):
                features += 1
    return {"feature_count": features}

@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Run analyzer.py with subprocess
    try:
        result = subprocess.run(
            ["python", "genome/analyzer.py", "--input", filepath],
            capture_output=True, text=True, check=True
        )
        output = json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        return jsonify({"error": "Analyzer failed", "details": e.stderr}), 500

    return jsonify({"message": "Upload successful", "resultPage": f"/results/sequence/{file.filename}"})
    

@app.route("/results/sequence/<filename>", methods=["GET"])
def sequence_results(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404

    try:
        result = subprocess.run(
            ["python", "genome/analyzer.py", "--input", filepath],
            capture_output=True, text=True, check=True
        )
        output = json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        return jsonify({"error": "Analyzer failed", "details": e.stderr}), 500

    return jsonify(output)
    
@app.route("/variant-detect", methods=["POST"])
def variant_detect():
    data = request.get_json()
    if not data or "filepath" not in data:
        return jsonify({"error": "No filepath provided"}), 400

    filePath = data["filepath"]

    if not os.path.exists(filePath):
        return jsonify({"error": "File not found"}), 404

    try:
        result = subprocess.run(
            ["python", "backend/genome/variant_detector.py", filePath],
            capture_output=True, text=True, check=True
        )
        output = json.loads(result.stdout)
        return jsonify(output)
    except subprocess.CalledProcessError as e:
        return jsonify({"error": "Variant detector failed", "details": e.stderr}), 500
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON output from variant detector"}), 500

# app.py (Flask backend)

@app.route("/predict", methods=["POST"])
def predict():
    if model_pipeline is None:
        return jsonify({"error": "Model not loaded"}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    try:
        ext = os.path.splitext(file.filename)[1].lower()
        if ext in [".fasta", ".fa"]:
            features = parse_fasta(filepath)
        elif ext == ".vcf":
            features = parse_vcf(filepath)
        elif ext == ".gff":
            features = parse_gff(filepath)
        else:
            return jsonify({"error": f"Unsupported file type: {ext}"}), 400

        input_data = pd.DataFrame([features])
        prediction = model_pipeline.predict(input_data).tolist()
        probabilities = model_pipeline.predict_proba(input_data).tolist()

        return jsonify({
            "message": "Prediction successful",
            "predictions": prediction,
            "probabilities": probabilities,
            "features_used": input_data.to_dict(orient="records")
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(filepath):
            os.remove(filepath)
    
if __name__ == "__main__":
    app.run(debug=True, port=8000)
