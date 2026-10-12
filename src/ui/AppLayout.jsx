import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

function AppLayout({ favorites, handleFavorites }) {
  return (
    <div className="box-border flex min-h-screen bg-gray-100 text-black">
      <Navbar favorites={favorites.length} />

      <main className="mx-auto w-full max-w-7xl min-w-0 flex-1 px-15 py-5">
        <Outlet context={{ favorites, handleFavorites }} />
      </main>
    </div>
  );
}

export default AppLayout;
