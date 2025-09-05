// src/services/genomeService.js
import axios from "axios";

// Create axios instance with base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api/genome", // adjust if backend runs elsewhere
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Upload genome file
export const uploadGenomeFile = async (file, consentId, projectId = null) => {
  const formData = new FormData();

  // 👇 must match backend multer.single("genomeFile")
  formData.append("genomeFile", file);
  formData.append("consentId", consentId);
  if (projectId) formData.append("projectId", projectId);

  const res = await API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// ✅ Get user files
export const getMyFiles = async (params = {}) => {
  const res = await API.get("/my-files", { params });
  return res.data;
};

// ✅ Download file by UUID
export const downloadFile = async (fileId) => {
  const res = await API.get(`/download/${fileId}`, {
    responseType: "blob", // needed for file download
  });
  return res;
};

// ✅ Delete file
export const deleteFile = async (fileId) => {
  const res = await API.delete(`/${fileId}`);
  return res.data;
};

// ✅ Assign file to project
export const assignFileToProject = async (fileId, projectId) => {
  const res = await API.patch(`/${fileId}/assign-project`, { projectId });
  return res.data;
};

// ✅ Unassign project
export const unassignFileFromProject = async (fileId) => {
  const res = await API.delete(`/${fileId}/unassign-project`);
  return res.data;
};
