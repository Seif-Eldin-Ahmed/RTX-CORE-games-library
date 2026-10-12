import { Link, NavLink } from "react-router-dom";

import home from "../images/home.png";
import favorite from "../images/favorite.png";
import discover from "../images/discover.png";
import profile from "../images/profile.png";

function Navbar({ favorites }) {
  return (
    <div className="max-w-64 flex-1 bg-white px-4 py-6">
      <Link
        to="/"
        className="flex items-center gap-0.5 py-2 pb-4 text-xl font-semibold transition-all duration-300 ease-in-out hover:scale-[1.04]"
      >
        <img src="/src/images/logo.png" className="max-w-8" />
        RTX CORE
      </Link>

      <nav>
        <ul className="px-2">
          <li>
            <NavLink
              to="/"
              className="flex items-center gap-2 pb-3 transition-all duration-300 ease-in-out hover:scale-[1.04]"
            >
              <img src={home} alt="Home" className="max-w-5" />
              Home
            </NavLink>
          </li>

          <li>
            <NavLink className="flex items-center gap-2 pb-3 transition-all duration-300 ease-in-out hover:scale-[1.04]">
              <img src={discover} alt="Discover" className="max-w-5" />
              Discover
            </NavLink>
          </li>

          <li>
            <NavLink
              to="favorites"
              className="flex items-center gap-2 pb-3 transition-all duration-300 ease-in-out hover:scale-[1.04]"
            >
              <img src={favorite} alt="Favorites" className="max-w-5" />
              Favorites ({favorites})
            </NavLink>
          </li>

          <li>
            <NavLink className="flex items-center gap-2 pb-3 transition-all duration-300 ease-in-out hover:scale-[1.04]">
              <img src={profile} alt="My Profile" className="max-w-5" />
              My Profile
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
