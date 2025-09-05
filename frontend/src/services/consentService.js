// src/services/consentService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/consents"; // matches backend route

// Sign consent
export const signConsent = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("[consentService] Signing consent with token:", token ? 'present' : 'missing');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    
    const res = await axios.post(
      `${API_URL}/sign`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log("[consentService] Consent signed successfully:", res.data);
    
    // Store consent ID in localStorage
    if (res.data.consent && res.data.consent.consentId) {
      localStorage.setItem('consentId', res.data.consent.consentId);
      console.log("[consentService] Stored consentId:", res.data.consent.consentId);
    }
    
    return res.data;
  } catch (error) {
    console.error("[consentService] Error signing consent:", error);
    
    let errorMessage = 'Failed to sign consent';
    
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
      
      switch (error.response.status) {
        case 401:
          errorMessage = 'Please log in to sign consent';
          break;
        case 403:
          errorMessage = 'You do not have permission to sign consent';
          break;
        case 409:
          errorMessage = 'You have already signed a consent form';
          break;
        case 500:
          errorMessage = 'Server error occurred. Please try again later';
          break;
        default:
          errorMessage = error.response.data?.message || 'Failed to sign consent';
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection';
    } else {
      errorMessage = error.message || 'An unexpected error occurred';
    }
    
    throw new Error(errorMessage);
  }
};

// Get all consents (admin/debug use)
export const getConsents = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Get consent by ID
export const getConsentById = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
