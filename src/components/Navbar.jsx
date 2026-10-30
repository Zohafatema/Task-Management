
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CheckSquare, LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <CheckSquare size={26} />
        TaskFlow
      </Link>

      {user && (
        <div className="nav-right">
          <span>Hi, {user.name}</span>

          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={17} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
