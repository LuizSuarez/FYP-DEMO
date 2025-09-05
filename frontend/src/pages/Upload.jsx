// src/pages/Upload.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { uploadGenomeFile } from "../services/genomeService";
import { Upload as UploadIcon, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../context/authContext";
import { useConsent } from "../context/consentContext";

function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [needsConsent, setNeedsConsent] = useState(false);
  const [consentError, setConsentError] = useState(null);
  const [signingConsent, setSigningConsent] = useState(false);
  const { user } = useAuth();
  const { consent, handleSignConsent } = useConsent();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading user...
      </div>
    );
  }

  const handleSignConsentClick = async () => {
    try {
      setSigningConsent(true);
      setConsentError(null);
      await handleSignConsent();
      setNeedsConsent(false);
      // After consent is signed, try to upload the file if one was selected
      if (file) {
        handleFileUpload();
      }
    } catch (err) {
      console.error('Failed to sign consent:', err);
      setConsentError(err.message || 'Failed to sign consent. Please try again.');
    } finally {
      setSigningConsent(false);
    }
  };

  const handleFileUpload = async () => {
    const consentId = localStorage.getItem("consentId");
    if (!consentId) {
      setNeedsConsent(true);
      return;
    }

    setStatus("uploading");

    try {
      const res = await uploadGenomeFile(file, consentId);
      console.log("✅ Upload success:", res);
      setStatus("success");
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setStatus("error");
    }
  };

  const handleChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (!selectedFile) return;

    // Check if user has consent
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
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setStatus("error");
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

        {status === "uploading" && (
          <motion.p
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-yellow-400"
          >
            Uploading...
          </motion.p>
        )}
        {status === "success" && (
          <motion.p
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center justify-center gap-2 text-green-400"
          >
            <CheckCircle className="w-5 h-5" /> Upload successful!
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center justify-center gap-2 text-red-400"
          >
            <XCircle className="w-5 h-5" /> Upload failed. Try again.
          </motion.p>
        )}
        
        {needsConsent && (
          <motion.div
            key="consent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-yellow-600/20 border border-yellow-600/30 rounded-lg"
          >
            <p className="text-yellow-300 mb-3">You need to sign a consent form before uploading genome data.</p>
            
            {consentError && (
              <div className="mb-3 p-2 bg-red-600/20 border border-red-600/30 rounded text-red-300 text-sm">
                {consentError}
              </div>
            )}
            
            <button
              onClick={handleSignConsentClick}
              disabled={signingConsent}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
            >
              {signingConsent ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Signing...
                </div>
              ) : (
                'Sign Consent'
              )}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Upload;
