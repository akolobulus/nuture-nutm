import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { Camera, User, Mail, Phone, Calendar, MapPin, Edit2, Save, Loader2, Trophy, Flame } from "lucide-react";
import { useBackend } from "../lib/useBackend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  const { user: clerkUser } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const backend = useBackend();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const userData = await backend.users.get();
      setFullName(userData.fullName);
      setPhoneNumber(userData.phoneNumber || "");
      setBio(userData.bio || "");
      setDateOfBirth(userData.dateOfBirth || "");
      setAddress(userData.address || "");
      return userData;
    },
  });

  const { data: streak } = useQuery({
    queryKey: ["streak"],
    queryFn: async () => await backend.gamification.getStreak(),
  });

  const uploadPicture = useMutation({
    mutationFn: async (file: File) => {
      const { uploadUrl, fileUrl } = await backend.users.uploadProfilePicture();
      
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      await backend.users.setProfilePicture({ profilePictureUrl: fileUrl });
      return fileUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({
        title: "Success!",
        description: "Profile picture updated successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProfile = useMutation({
    mutationFn: async () => {
      await backend.users.updateProfile({
        fullName,
        phoneNumber,
        bio,
        dateOfBirth,
        address,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setIsEditing(false);
      toast({
        title: "Success!",
        description: "Profile updated successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Update error:", error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      uploadPicture.mutate(file);
    }
  };

  const getRankColor = (rank: string) => {
    const colors: Record<string, string> = {
      "Novice": "bg-gray-500/20 text-gray-500",
      "Bronze": "bg-amber-700/20 text-amber-700",
      "Silver": "bg-gray-400/20 text-gray-400",
      "Gold": "bg-yellow-500/20 text-yellow-500",
      "Platinum": "bg-cyan-500/20 text-cyan-500",
      "Diamond": "bg-blue-500/20 text-blue-500",
      "Legend": "bg-purple-500/20 text-purple-500",
    };
    return colors[rank] || colors["Novice"];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#00A859]" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold mb-8">My Profile</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#00A859] hover:bg-[#008f4a]"
                          onClick={() => updateProfile.mutate()}
                          disabled={updateProfile.isPending}
                        >
                          {updateProfile.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {user?.profilePictureUrl || clerkUser?.imageUrl ? (
                          <img
                            src={user?.profilePictureUrl || clerkUser?.imageUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-muted-foreground" />
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-[#00A859] rounded-full text-white hover:bg-[#008f4a] transition-colors"
                        disabled={uploadPicture.isPending}
                      >
                        {uploadPicture.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{user?.fullName}</h3>
                      <p className="text-muted-foreground">{user?.email}</p>
                      <Badge className="mt-2" variant={user?.verified ? "default" : "secondary"}>
                        {user?.verified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      {isEditing ? (
                        <Input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      ) : (
                        <p className="text-sm py-2">{user?.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>NUTM ID</Label>
                      <p className="text-sm py-2">{user?.nutmId}</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="flex items-center gap-2 py-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm">{user?.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      {isEditing ? (
                        <Input
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+234 XXX XXX XXXX"
                        />
                      ) : (
                        <div className="flex items-center gap-2 py-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm">{user?.phoneNumber || "Not set"}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 py-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm">{user?.dateOfBirth || "Not set"}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Address</Label>
                      {isEditing ? (
                        <Input
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Your address"
                        />
                      ) : (
                        <div className="flex items-center gap-2 py-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm">{user?.address || "Not set"}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Bio</Label>
                    {isEditing ? (
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself"
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm py-2">{user?.bio || "No bio set"}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#00A859]" />
                    Gamification Stats
                  </CardTitle>
                  <CardDescription>Track your engagement and earn rewards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rank</span>
                    <Badge className={getRankColor(streak?.rank || "Novice")}>
                      {streak?.rank || "Novice"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Points</span>
                    <span className="text-xl font-bold text-[#00A859]">
                      {streak?.totalPoints || 0}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold">Streaks</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Current</p>
                        <p className="text-2xl font-bold">{streak?.currentStreak || 0}</p>
                        <p className="text-xs text-muted-foreground">days</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Longest</p>
                        <p className="text-2xl font-bold">{streak?.longestStreak || 0}</p>
                        <p className="text-xs text-muted-foreground">days</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#00A859]/10 border border-[#00A859]/20 rounded-lg p-3">
                    <p className="text-sm">
                      Stay active daily to maintain your streak and climb the leaderboard!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
