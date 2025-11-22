import Layout from "./components/Layout";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import toast, { Toaster } from "react-hot-toast";
import NotificationsPage from "./pages/NotificationsPage";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./axios";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/notifications"
          element={!authUser ? <Login /> : <NotificationsPage />}
        ></Route>

        <Route
          path="/network"
          element={!authUser ? <Login /> : <NetworkPage />}
        ></Route>

        <Route
          path="/post/:postId"
          element={!authUser ? <Login /> : <PostPage />}
        ></Route>

        <Route
          path="/profile/:username"
          element={!authUser ? <Login /> : <ProfilePage />}
        ></Route>
      </Routes>
      <Toaster />
    </Layout>
  );
};

export default App;
