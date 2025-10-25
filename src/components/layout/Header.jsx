import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Gamepad2, Trophy, Info } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/game", label: "Play", icon: Gamepad2 },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <header className="bg-gray-800 border-b border-yellow-400">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
            <span className="text-2xl font-bold text-yellow-400">PAC-MAN</span>
          </Link>

          <div className="flex space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === path
                    ? "bg-yellow-400 text-gray-900"
                    : "text-gray-300 hover:text-yellow-400"
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
