import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const FriendRequest = ({ request }) => {
  const queryClient = useQueryClient();

  const { mutate: acceptConnectionRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request accepted");
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
      queryClient.invalidateQueries({
        queryKey: ["my-connections-requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["connections"],
      });
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: rejectConnectionRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request rejected");
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
      queryClient.invalidateQueries({
        queryKey: ["my-connections-requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["connections"],
      });
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <Link to={`/profile/${request.sender.username}`}>
          <img
            src={request.sender.profilePicture || "/avatar.png"}
            alt={request.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </Link>

        <div>
          <Link
            to={`/profile/${request.sender.username}`}
            className="font-semibold text-lg text-gray-800 dark:text-gray-100"
          >
            {request.sender.name}
          </Link>
          <p className="text-gray-600 dark:text-gray-400">
            {request.sender.headline}
          </p>
        </div>
      </div>

      <div className="space-x-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => acceptConnectionRequest(request._id)}
        >
          Accept
        </button>
        <button
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          onClick={() => rejectConnectionRequest(request._id)}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;
