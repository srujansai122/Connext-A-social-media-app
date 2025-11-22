import React, { useState } from "react";
import { FaUserTag, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import toast from "react-hot-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();

  const { mutate: loginMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/login", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Logged in successfully 🎉");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message + " 😔" || "Something went wrong 😔"
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation({ username, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-base-200 to-base-100 px-4">
      <div className="w-full max-w-md bg-white dark:bg-base-200 shadow-2xl rounded-xl p-6 transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          Welcome Back to Connext
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2 text-base-content">
                <FaUserTag /> Username
              </span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe123"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2 text-base-content">
                <FaLock /> Password
              </span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-primary w-full mt-4 transition-transform duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"
            }`}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-base-content">
          Don't have an account?
          <Link
            to="/signup"
            className="text-primary font-semibold hover:underline"
          >
            SignUp
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
