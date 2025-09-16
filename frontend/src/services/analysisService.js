// src/services/analysisService.js
import axios from "axios";

// Create axios instance with base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api/analysis",
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Run sequence analysis on a genome file
export const runSequenceAnalysis = async (fileId) => {
  const res = await API.post(`/sequence/${fileId}`);
  return res.data;
};

// ✅ Get all my analyses with explicit token in headers
export const getMyAnalyses = async (token, params = {}) => {
  const res = await API.get("/my", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return res.data;
};


// ✅ Get specific analysis by ID
export const getAnalysis = async (analysisId) => {
  const res = await API.get(`/${analysisId}`);
  return res.data;
};

// ✅ Get GC content for all user analyses
export const getGCContentForUser = async () => {
  const res = await API.get("/gc-content/all");
  return res.data;
};

// ✅ Get codon frequencies for specific analysis
export const getCodonFrequencies = async (analysisId) => {
  const res = await API.get(`/${analysisId}/codon-frequencies`);
  return res.data;
};

// ✅ Get analysis metrics
export const getAnalysisMetrics = async (analysisId) => {
  const res = await API.get(`/${analysisId}/metrics`);
  return res.data;
};
