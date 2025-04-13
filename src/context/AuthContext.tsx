
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface User {
  _id: string;
  username: string;
  email: string;
  address?: string;
  phone?: string;
  isAdmin: boolean;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  address?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin || false;

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // For demo purposes, we're mocking the backend API call
      if (email === "admin@gmail.com" && password === "admin@123") {
        const adminUser = {
          _id: "admin123",
          username: "admin",
          email: "admin@gmail.com",
          isAdmin: true,
        };
        setUser(adminUser);
        localStorage.setItem("user", JSON.stringify(adminUser));
        toast({
          title: "Login Successful",
          description: "Welcome back, Admin!",
        });
        return;
      }

      // Mock regular user login
      const mockUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = mockUsers.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const userWithoutPassword = {
          ...foundUser,
          isAdmin: false,
        };
        delete userWithoutPassword.password;
        
        setUser(userWithoutPassword);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        toast({
          title: "Login Successful",
          description: `Welcome back, ${userWithoutPassword.username}!`,
        });
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      // For demo purposes, we're mocking the backend API call
      const mockUsers = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if email already exists
      if (mockUsers.some((user: any) => user.email === userData.email)) {
        throw new Error("Email already exists");
      }
      
      const newUser = {
        _id: `user_${Date.now()}`,
        ...userData,
        isAdmin: false,
      };
      
      mockUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(mockUsers));
      
      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Signup Successful",
        description: `Welcome, ${userData.username}!`,
      });
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error("User not authenticated");
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update in users array too if it's not admin
      if (!user.isAdmin) {
        const mockUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const updatedUsers = mockUsers.map((u: any) => 
          u._id === user._id ? { ...u, ...userData } : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
