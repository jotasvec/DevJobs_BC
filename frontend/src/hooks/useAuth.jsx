import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("use Auth must be used with AuthProvider");

  return context;
}