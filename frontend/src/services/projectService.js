// src/services/projectService.js
import axios from "axios";

// Create axios instance with base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api/projects",
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Create new project
export const createProject = async (projectData) => {
  const res = await API.post("/", projectData);
  return res.data;
};

// ✅ Get all my projects
export const getMyProjects = async () => {
  const res = await API.get("/");
  return res.data;
};

// ✅ Get project by ID
export const getProjectById = async (projectId) => {
  const res = await API.get(`/${projectId}`);
  return res.data;
};

// ✅ Update project
export const updateProject = async (projectId, projectData) => {
  const res = await API.put(`/${projectId}`, projectData);
  return res.data;
};

// ✅ Delete project
export const deleteProject = async (projectId) => {
  const res = await API.delete(`/${projectId}`);
  return res.data;
};
