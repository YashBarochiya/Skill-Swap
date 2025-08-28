import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import api from "../api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

  // load from storage on init
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        localStorage.removeItem("token");
      }
    }
    setLoading(false); // ✅ done checking
  }, []);

  // login
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.token;
    localStorage.setItem("token", token);
    setUser(jwtDecode(token));
  };

  // signup
  const signup = async (name, email, password) => {
    const res = await api.post("/auth/signup", { name, email, password });
    const token = res.data.token;
    localStorage.setItem("token", token);
    setUser(jwtDecode(token));
  };

//   // google login
//   const googleLogin = async (googleToken) => {
//     const res = await api.post("/auth/google", { token: googleToken });
//     const token = res.data.token;
//     localStorage.setItem("token", token);
//     setUser(jwtDecode(token));
//   };

  // logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user,loading, login, signup,  logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
