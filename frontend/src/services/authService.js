import axios from "axios";
import { useAuth } from "../context/authContext";

const API_URL = "http://localhost:5000/api/auth";

// Create axios instance
const API = axios.create({
  baseURL: API_URL,
});

// Standard service methods (non-hook)
export const authService = {
  // Register user
  register: async (formData) => {
    const res = await API.post("/register", formData);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  // Login user
  login: async (credentials) => {
    const res = await API.post("/login", credentials);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const res = await API.post("/forgot-password", { email, });
    return res.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
  const res = await axios.post(`/api/auth/reset-password/${token}`, {
    password,
  });
  return res.data;
},


  // Get dashboard data
  getDashboard: async () => {
    const token = localStorage.getItem("token");
    const res = await API.get("/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// Custom hook to use auth services (existing functionality)
export const useAuthService = () => {
  const { user, token, setUser, setToken, logout } = useAuth();

  // Login
  const login = async (credentials) => {
    const res = await API.post("/login", credentials);
    if (res.data.token) {
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  // Register
  const register = async (formData) => {
    const res = await API.post("/register", formData);
    if (res.data.token) {
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const verifyEmail = async (token) => {
    const res = await API.get(`/verify-email/${token}`);
    return res.data;
  };

    const forgotPassword = async (email) => {
    const res = await API.post("/forgot-password", { email });
    return res.data;
  };

  const resetPassword = async (token, password) => {
    const res = await API.post(`/reset-password/${token}`, { password });
    return res.data;
  };

  // ✅ loginWithToken integrated
  const loginWithToken = async (token) => {
    const res = await API.get("/login-with-token", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.token && res.data.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res.data; // { user, token }
  };

  // Logout
  const signout = () => {
    logout();
  };

  // Auth Axios instance (auto adds token from context)
  const authAxios = axios.create();
  authAxios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return {
    user,
    token,
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    signout,
    authAxios,
    loginWithToken,
  };
};
