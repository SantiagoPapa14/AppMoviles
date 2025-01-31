import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { API_BASE_URL } from "@/constants/API-IP";
import { API_TOKEN_KEY } from "@/constants/API-TOKEN";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  updateToken?: (token: string) => void;
  fetchProfile?: () => Promise<any>;
  updateProfile?: () => Promise<any>; 
  onRegister?: (
    email: string,
    username: string,
    name: string,
    password: string,
    imageUri: string,
  ) => Promise<void>;
  onLogin?: (email: string, password: string) => Promise<void>;
  onLogout?: () => Promise<void>;
  secureFetch?: (route: string, params?: any) => Promise<any | Array<any>>;
  uploadImage?: (imageUri: string) => Promise<void>;
  uploadAttachment?: (file: any) => Promise<void>;
   
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
  const [hasBeenUpdated, setHasBeenUpdated] = useState<boolean>(false);

  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    console.log('NOUPDATED',profile)
    if (!profile || (profile && hasBeenUpdated)) {
      const userProfile = await secureFetch("/user");
      setProfile(userProfile);
      setHasBeenUpdated(false)
      return userProfile;
      
    } else { 
      return profile;
    }
  };

  const updateProfile = async () => {
    setHasBeenUpdated(true)
  }

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem(API_TOKEN_KEY);
      if (token) {
        setAuthState({
          token,
          authenticated: true,
        });
      }
    };
    loadToken();
  }, []);

  const register = async (
    email: string,
    username: string,
    name: string,
    password: string,
    imageUri: string,
  ) => {
    const res = await fetch(`${API_BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, name, password }),
    });

    const data = await res.json();
    if (data.token) {
      setAuthState({
        token: data.token.toString(),
        authenticated: true,
      });
      await AsyncStorage.setItem(API_TOKEN_KEY, data.token.toString());
      await uploadImage(imageUri, data.token.toString());
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
    setProfile(null);
  };

  const secureFetch = async (route: string, params?: any) => {
    if (!params) params = {};
    params.headers = {
      ...params.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${authState?.token}`, // Use token from authState
    };
    const res = await fetch(API_BASE_URL + route, params);

    if (res.status === 401) {
      await logout()
    };

    const data = await res.json();
    return data;
  };

  const updateToken = async (token: string) => {
    await AsyncStorage.setItem(API_TOKEN_KEY, token);
    setAuthState({
      token,
      authenticated: authState?.authenticated,
    });
  };

  const uploadImage = async (imageUri: string, forceToken?: string) => {
    if (!imageUri) {
      Alert.alert("Error", "Please select an image first.");
      return;
    }

    const formData = new FormData();
    const file = {
      uri: imageUri,
      type: "image/jpeg",
      name: `profile_picture.jpg`,
    };

    formData.append("profile_picture", file as any);

    try {
      const response = await fetch(
        `${API_BASE_URL}/file/upload-profile-picture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization:
              "Bearer " + (forceToken ? forceToken : authState?.token),
          },
          body: formData,
        },
      );

      if (!response.ok) {
        Alert.alert(
          "Error",
          `Failed to upload image: ${JSON.stringify(response)}`,
        );
      }
    } catch (error) {
      Alert.alert("Error", `Failed to upload image: ${error}`);
    }
  };

  const uploadAttachment = async (file: any, forceToken?: string) => {
    const formData = new FormData();
    formData.append("summary_attachment", file);

    try {
      const response = await fetch(
        `${API_BASE_URL}/file/upload-summary-attachment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization:
              "Bearer " + (forceToken ? forceToken : authState?.token),
          },
          body: formData,
        },
      );

      if (!response.ok) {
        Alert.alert(
          "Error",
          `Failed to upload file: ${JSON.stringify(response)}`,
        );
      }
    } catch (error) {
      Alert.alert("Error", `Failed to upload file: ${error}`);
    }
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
    updateToken: updateToken,
    fetchProfile,
    secureFetch: secureFetch,
    uploadImage: uploadImage,
    uploadAttachment: uploadAttachment,
    updateProfile: updateProfile,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
