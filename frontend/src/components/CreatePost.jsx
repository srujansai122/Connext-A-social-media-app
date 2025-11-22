import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../axios";
import toast from "react-hot-toast";
import { Image, Loader } from "lucide-react";

const CreatePost = ({ user }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const queryClient = useQueryClient();

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/posts/create", postData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      resetForm();
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create post");
    },
  });

  const handlePostCreation = async () => {
    try {
      if (!content && !image) {
        toast.error("Post can't be empty");
        return;
      }
      const postData = { content };
      if (image) postData.image = await readFileAsDataURL(image);

      createPostMutation(postData);
    } catch (error) {
      console.error("Error in handlePostCreation:", error);
    }
  };

  const resetForm = () => {
    setContent("");
    setImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      readFileAsDataURL(file).then(setImagePreview);
    } else {
      setImagePreview(null);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg mb-6 p-5 transition-colors duration-300">
      <div className="flex space-x-3">
        <img
          src={user?.profilePicture || "/avatar.png"}
          alt={user.name}
          className="size-12 rounded-full border border-gray-300 dark:border-gray-700"
        />
        <textarea
          placeholder="Post your thoughts or accomplishments..."
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {imagePreview && (
        <div className="mt-4">
          <img
            src={imagePreview}
            alt="Selected"
            className="w-full h-auto rounded-lg border border-gray-300 dark:border-gray-700"
          />
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-4">
          <label className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 cursor-pointer">
            <Image size={20} className="mr-2" />
            <span>Add Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <button
          className="bg-blue-600 dark:bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
          onClick={handlePostCreation}
          disabled={isPending}
        >
          {isPending ? <Loader className="size-5 animate-spin" /> : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
