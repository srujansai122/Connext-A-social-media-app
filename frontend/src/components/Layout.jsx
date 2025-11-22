import React from "react";
import Navbar from "./Navbar";
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-full mx-auto px-3 py-4">{children}</main>
    </div>
  );
};

export default Layout;
