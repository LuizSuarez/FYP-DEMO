// src/context/GenomeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getMyFiles, uploadGenomeFile, deleteFile } from "@/services/genomeService";
import { useAuth } from "@/context/authContext"; // assuming you have an AuthContext

const GenomeContext = createContext();

export const GenomeProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    const currentToken = localStorage.getItem("token");
    console.log("User token:", currentToken); // Debug log
    
    if (!currentToken) {
      console.log("No token available, skipping file fetch");
      return;
    }
    
    try {
      setLoading(true);
      const data = await getMyFiles({}); // getMyFiles handles token internally
      setFiles(data.success ? data.data.files : []);
    } catch (err) {
      console.error("Failed to fetch files:", err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };


  const uploadFile = async (file, consentId, projectId) => {
    try {
      const res = await uploadGenomeFile(file, consentId, projectId); // service handles token internally
      await fetchFiles(); // refresh
      return res;
    } catch (err) {
      throw err;
    }
  };

  const removeFile = async (fileId) => {
    try {
      await deleteFile(fileId); // service handles token internally
      setFiles((prev) => prev.filter((f) => f.fileId !== fileId));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchFiles();
    }
  }, [user, token]);

  return (
    <GenomeContext.Provider value={{ files, loading, uploadFile, removeFile, fetchFiles }}>
      {children}
    </GenomeContext.Provider>
  );
};

export const useGenome = () => useContext(GenomeContext);
export default GenomeContext;