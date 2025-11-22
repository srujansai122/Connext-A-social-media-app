import { Link } from "react-router-dom";
import { Home, UserPlus, Bell } from "lucide-react";

export default function Sidebar({ user }) {
  return (
    <aside className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-md transition-colors duration-300">
      <div className="relative">
        <div
          className="h-20 bg-cover bg-center rounded-t-lg"
          style={{
            backgroundImage: `url("${user.bannerImage || "/banner.png"}")`,
          }}
        />
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
          <Link to={`/profile/${user.username}`}>
            <img
              src={user.profilePicture || "/avatar.png"}
              alt={`${user.name}'s avatar`}
              className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
            />
          </Link>
        </div>
      </div>

      <div className="pt-16 pb-4 text-center px-4">
        <Link to={`/profile/${user.username}`}>
          <h2 className="text-lg font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {user.name}
          </h2>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {user.headline}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {user.connections.length} connections
        </p>
      </div>

      <nav className="border-t border-gray-200 dark:border-gray-700 px-4 py-6">
        <ul className="space-y-3">
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Home size={20} /> <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/network"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <UserPlus size={20} /> <span>My Network</span>
            </Link>
          </li>
          <li>
            <Link
              to="/notifications"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell size={20} /> <span>Notifications</span>
            </Link>
          </li>
        </ul>
      </nav>

      <footer className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 text-center">
        <Link
          to={`/profile/${user.username}`}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Visit your profile
        </Link>
      </footer>
    </aside>
  );
}
