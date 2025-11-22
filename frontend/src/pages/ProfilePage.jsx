import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios.js";

import ProfileHeader from "../components/profilePageComponents/ProfileHeader";
import AboutSection from "../components/profilePageComponents/AboutSection";
import ExperienceSection from "../components/profilePageComponents/ExperienceSection";
import EducationSection from "../components/profilePageComponents/EducationSection";
import SkillsSection from "../components/profilePageComponents/SkillsSection";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/checkLoggedInOrNot");
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 401) return null;
        toast.error(
          error?.response?.data?.message || "Something went Wrong 😔"
        );
      }
    },
  });

  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => axiosInstance.get(`/users/${username}`),
  });

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (updatedData) => {
      await axiosInstance.put("/users/profile", updatedData);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["userProfile", username]);
      queryClient.invalidateQueries(["authUser"]);
    },
  });

  if (isLoading || isUserProfileLoading) return null;

  const isOwnProfile = authUser.username === userProfile.data.username;
  const userData = userProfile.data;

  const handleSave = (updatedData) => {
    updateProfile(updatedData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProfileHeader
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <AboutSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <ExperienceSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <EducationSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <SkillsSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
    </div>
  );
};
export default ProfilePage;
