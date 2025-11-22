import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { axiosInstance } from "../axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  MdHome,
  MdGroup,
  MdNotifications,
  MdPerson,
  MdLogout,
  MdMenu,
} from "react-icons/md";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const queryClient = useQueryClient();

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

  const { data: userNotifications } = useQuery({
    queryKey: ["my-notifications"],
    queryFn: async () => axiosInstance.get("/notifications"),
    enabled: !!authUser,
  });

  const { data: userConnectionRequests } = useQuery({
    queryKey: ["my-connections-requests"],
    queryFn: async () => axiosInstance.get("/connections/requests"),
    enabled: !!authUser,
  });

  const { mutate: Logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      toast.success("Logged Out Successfully 👋");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Something went wrong 😔");
    },
  });

  const unreadNotifications =
    userNotifications?.data?.notifications?.filter((n) => !n.read).length || 0;
  const unreadConnections = userConnectionRequests?.data?.length || 0;

  return (
    <nav className="bg-neutral text-neutral-content shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          Connext
        </Link>

        <button
          className="md:hidden text-neutral-content"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <MdMenu size={28} />
        </button>

        <div className="hidden md:flex items-center gap-6">
          {authUser ? (
            <>
              <Link
                to="/"
                className="flex items-center gap-1 hover:text-primary"
              >
                <MdHome size={22} />
                <span>Home</span>
              </Link>
              <Link
                to="/network"
                className="relative flex items-center gap-1 hover:text-primary"
              >
                <MdGroup size={22} />
                {unreadConnections > 0 && (
                  <span className="badge badge-sm badge-info absolute -top-2 left-2">
                    {unreadConnections}
                  </span>
                )}
                <span>Network</span>
              </Link>
              <Link
                to="/notifications"
                className="relative flex items-center gap-1 hover:text-primary"
              >
                <MdNotifications size={22} />
                {unreadNotifications > 0 && (
                  <span className="badge badge-sm badge-info absolute -top-2 left-2">
                    {unreadNotifications}
                  </span>
                )}
                <span>Notifications</span>
              </Link>
              <Link
                to={`/profile/${authUser.username}`}
                className="flex items-center gap-1 hover:text-primary"
              >
                <MdPerson size={22} />
                <span>Profile</span>
              </Link>
              <button
                onClick={() => Logout()}
                className="flex items-center gap-1 hover:text-error"
              >
                <MdLogout size={22} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-neutral border-t border-base-300 px-4 py-2 space-y-2">
          {authUser ? (
            <>
              <Link to="/" className="block hover:text-primary">
                Home
              </Link>
              <Link to="/network" className="block hover:text-primary">
                Network ({unreadConnections})
              </Link>
              <Link to="/notifications" className="block hover:text-primary">
                Notifications ({unreadNotifications})
              </Link>
              <Link
                to={`/profile/${authUser.username}`}
                className="block hover:text-primary"
              >
                Profile
              </Link>
              <button
                onClick={() => Logout()}
                className="block hover:text-error"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block btn btn-ghost w-full">
                Sign In
              </Link>
              <Link to="/signup" className="block btn btn-primary w-full">
                Join Now
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
