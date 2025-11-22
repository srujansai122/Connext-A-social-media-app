import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./../axios";
import { toast } from "react-hot-toast";
import { Users } from "lucide-react";
import CreatePost from "./../components/CreatePost";
import Suggestions from "../components/Suggestions";
import Post from "../components/Post";
const HomePage = () => {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/checkLoggedInOrNot");
        return res.data;
      } catch (error) {
        if (error.response?.status === 401) return null;
        toast.error(
          error?.response?.data?.message || "Something went wrong 😔"
        );
      }
    },
  });

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/users/suggestions");
        return res.data;
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <div className="col-span-2 lg:col-span-4  order-first lg:order-none">
        <CreatePost user={authUser} />

        {posts?.length > 0 ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 text-center transition-colors duration-300">
            <div className="mb-6">
              <Users
                size={64}
                className="mx-auto text-blue-500 dark:text-blue-400"
              />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              No Posts Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with people you know to start seeing posts!
            </p>
          </div>
        )}
      </div>

      {recommendedUsers?.length > 0 && (
        <div className="col-span-1 lg:col-span-2 hidden lg:block">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 transition-colors duration-300">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
              People you may know
            </h2>
            <div className="space-y-3">
              {recommendedUsers.map((user) => (
                <Suggestions key={user._id} user={user} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
