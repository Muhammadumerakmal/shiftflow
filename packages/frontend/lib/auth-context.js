"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedStoreId = localStorage.getItem("storeId");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedStoreId) setStoreId(savedStoreId);
    setLoading(false);
  }, []);

  async function login(email, password) {
    const result = await api.login(email, password);
    localStorage.setItem("accessToken", result.accessToken);
    localStorage.setItem("user", JSON.stringify(result.user));
    if (result.user.storeId) {
      localStorage.setItem("storeId", result.user.storeId);
      setStoreId(result.user.storeId);
    }
    setUser(result.user);
    return result;
  }

  async function register(payload) {
    const result = await api.register(payload);
    localStorage.setItem("accessToken", result.accessToken);
    localStorage.setItem("user", JSON.stringify(result.user));
    localStorage.setItem("storeId", result.store.id);
    setUser(result.user);
    setStoreId(result.store.id);
    return result;
  }

  function setActiveStore(id) {
    localStorage.setItem("storeId", id);
    setStoreId(id);
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("storeId");
    setUser(null);
    setStoreId(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, storeId, loading, login, register, logout, setActiveStore }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
