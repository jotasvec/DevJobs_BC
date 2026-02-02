import React, { createContext, useContext, useState } from 'react'


export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    // === Handle LogIn and LogOut
    const login = () => { 
        setIsLoggedIn(true)
    }
    const logout = () => { 
        setIsLoggedIn(true)
    }


  const value = {
    isLoggedIn,
    login,
    logout
  } 

  return <AuthContext value={value}> {children} </AuthContext>

}

export function useAuth(){
  const context = useContext(AuthContext)
  if(context === undefined) throw new Error("useAuth must be used with AuthProvider");
  
  
  return context;
}

