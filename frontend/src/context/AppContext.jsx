import { createContext, useState, useEffect } from "react";
import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const getUserData = async () => {
    if (!token) {
      console.log("No token available");
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + "api/user/data", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (data.success) {
        setUserData(data.userData);
        console.log("User data fetched:", data.userData);
      } else {
        toast.error(data.message || "Failed to fetch user data");
        setUserData(null);
        setIsLoggedin(false);
      }
    } catch (error) {
      console.error("getUserData error:", error);
      if (error.response?.status === 401) {
        setIsLoggedin(false);
        setUserData(null);
        setToken(null);
        localStorage.removeItem("token");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to fetch user data."
        );
      }
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(backendUrl + "api/user/data", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (data.success) {
          setIsLoggedin(true);
          setUserData(data.userData);
        }
      } catch (error) {
        setIsLoggedin(false);
        setUserData(null);
        setToken(null);
        localStorage.removeItem("token");
      }
    };

    if (token) {
      checkAuthStatus();
    }
  }, [backendUrl, token]);

  // Update token in localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    token,
    setToken,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};
