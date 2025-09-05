// src/context/ConsentContext.js
import { createContext, useContext, useState } from "react";
import { signConsent } from "@/services/consentService";

const ConsentContext = createContext();

export const ConsentProvider = ({ children }) => {
  const [consent, setConsent] = useState(null);

  const handleSignConsent = async () => {
    try {
      console.log('Attempting to sign consent...');
      const data = await signConsent();
      console.log('Consent signed successfully:', data);
      setConsent(data);
      
      // Store the consentId (UUID) not the MongoDB _id
      const consentId = data.consent?.consentId || data.consentId;
      if (consentId) {
        localStorage.setItem("consentId", consentId);
        console.log('Stored consentId:', consentId);
      }
      return data;
    } catch (err) {
      console.error("Consent signing failed:", err);
      
      // Provide more specific error messages
      if (err.response?.status === 500) {
        const errorMessage = err.response?.data?.error || 'Internal server error occurred';
        console.error('Server error details:', err.response?.data);
        throw new Error(`Server Error: ${errorMessage}`);
      } else if (err.response?.status === 401) {
        throw new Error('You must be logged in to sign consent');
      } else if (err.response?.status === 403) {
        throw new Error('You do not have permission to sign consent');
      } else {
        throw new Error(err.message || 'Failed to sign consent');
      }
    }
  };

  return (
    <ConsentContext.Provider value={{ consent, handleSignConsent }}>
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = () => useContext(ConsentContext);
