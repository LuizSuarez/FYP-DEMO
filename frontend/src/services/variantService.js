// src/services/variantService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/variants";

// Start a new variant detection analysis for a file
export const runVariantDetection = async (fileId, token) => {
  const res = await axios.get(`${API_URL}/detect/${fileId}`, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } });
  return res.data; // { message, analysis }
};

// Get mutation density for a file
export const getMutationDensity = async (fileId, token) => {
  const res = await axios.get(`${API_URL}/mutation-density/${fileId}`, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } });
  return res.data; // { fileId, totalVariants, densities }
};

// Get region metrics for a file
export const getRegionMetrics = async (fileId, token) => {
  const res = await axios.get(`${API_URL}/region-metrics/${fileId}`, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } });
  return res.data; // { fileId, metrics }
};
