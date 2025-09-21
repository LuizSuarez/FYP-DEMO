# app.py
from flask import Flask, request, jsonify
import os, subprocess, json

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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


if __name__ == "__main__":
    app.run(debug=True, port=5000)
