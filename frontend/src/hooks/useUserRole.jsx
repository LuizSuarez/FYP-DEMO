import { useState, useEffect } from 'react';

export function useUserRole() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedData = localStorage.getItem('userData');
        console.log(storedData);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Get user role from stored user data, default to 'patient' if 'user' type
  const getUserRole = () => {
    if (!userData?.userType) return 'patient';
    return userData.userType === 'user' ? 'patient' : userData.userType;
  };
  
  return {
    userData,
    userRole: getUserRole(),
    loading,
  };
}