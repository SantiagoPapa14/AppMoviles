import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";
import { API_TOKEN_KEY } from "@/constants/API-TOKEN";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (email: string, password: string) => Promise<void>;
  onLogin?: (email: string, password: string) => Promise<void>;
  onLogout?: () => Promise<void>;
  secureFetch?: (route: string, params?: any) => Promise<any | Array<any>>;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        setAuthState({
          token,
          authenticated: true,
        });
      }
    };
    loadToken();
  }, []);

  const register = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.token) {
      setAuthState({
        token: data.token,
        authenticated: true,
      });

      await AsyncStorage.setItem(API_TOKEN_KEY, data.token.toString());

      return data;
    } else {
      alert(data.message);
    }

    return data;
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.token) {
      setAuthState({
        token: data.token,
        authenticated: true,
      });

      await AsyncStorage.setItem(API_TOKEN_KEY, data.token.toString());

      return data;
    } else {
      alert(data.message);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(API_TOKEN_KEY);
    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const secureFetch = async (route: string, params?: any) => {
    if (!params) params = {};
    params.headers = {
      ...params.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${authState?.token}`, // Use token from authState
    };
    const res = await fetch(API_BASE_URL + route, params);
    if (res.status === 401) await logout();
    const data = await res.json();
    return data;
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
    secureFetch: secureFetch,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
