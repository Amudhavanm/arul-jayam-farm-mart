
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Camera, Loader, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    profilePicture: user?.profilePicture || "",
  });
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      // Error is handled in the AuthContext
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, this would upload to a storage service
    // Here we'll create a data URL
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData((prev) => ({ ...prev, profilePicture: result }));
    };
    reader.readAsDataURL(file);
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const getUserInitials = () => {
    if (!user?.username) return "U";
    return user.username.charAt(0).toUpperCase();
  };
  
  if (!user) {
    navigate("/login");
    return null;
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" size={16} />
          Back
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl">Profile</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update your personal information"
                  : "View and manage your profile details"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <Avatar className="w-24 h-24 border-2 border-primary">
                      <AvatarImage src={formData.profilePicture} />
                      <AvatarFallback className="text-2xl bg-primary text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {isEditing && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full"
                        onClick={handleProfilePictureClick}
                      >
                        <Camera size={16} />
                      </Button>
                    )}
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  <h2 className="text-xl font-semibold">{user.username}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="resize-none"
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end mt-6 space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          username: user.username || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          address: user.address || "",
                          profilePicture: user.profilePicture || "",
                        });
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader size={16} className="mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-6">
              {!isEditing && (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex items-center"
                >
                  <UserIcon size={16} className="mr-2" />
                  Edit Profile
                </Button>
              )}
              
              <Button
                type="button"
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
