// src/pages/Upload.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { uploadGenomeFile } from "../services/genomeService";
import { Upload as UploadIcon, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useConsent } from "../context/consentContext";
import { useNavigate } from "react-router-dom";

function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [needsConsent, setNeedsConsent] = useState(false);
  const [consentError, setConsentError] = useState(null);
  const [signingConsent, setSigningConsent] = useState(false);
  const { user } = useAuth();
  const { handleSignConsent } = useConsent();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading user...
      </div>
    );
  }

  const handleFileUpload = async (selectedFile) => {
    const consentId = localStorage.getItem("consentId");
    if (!consentId) {
      setNeedsConsent(true);
      return;
    }

    setStatus("uploading");

    try {
      const res = await uploadGenomeFile(selectedFile, consentId);
      console.log("✅ Upload success:", res);
      setStatus("success");
      // Redirect to /analysis after upload
      navigate("/analysis");
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setStatus("error");
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-lg text-center border border-gray-700"
      >
        <h1 className="text-2xl font-bold mb-4 text-cyan-400">Upload Genome File</h1>
        <p className="text-gray-400 mb-6">
          Securely upload your <span className="text-cyan-300">FASTA, VCF,</span> or <span className="text-cyan-300">GFF</span> genome data files.
        </p>

        <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl py-10 px-6 hover:border-cyan-400 transition">
          <UploadIcon className="w-12 h-12 text-cyan-400 mb-2" />
          <span className="text-gray-300">
            {file ? file.name : "Click to select file"}
          </span>
          <input type="file" onChange={handleChange} className="hidden" />
        </label>

        {status === "uploading" && <p className="mt-4 text-yellow-400">Uploading...</p>}
        {status === "success" && (
          <p className="mt-4 flex items-center justify-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" /> Upload successful! Redirecting...
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 flex items-center justify-center gap-2 text-red-400">
            <XCircle className="w-5 h-5" /> Upload failed. Try again.
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default Upload;
