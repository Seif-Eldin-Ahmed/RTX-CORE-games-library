import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "./ui/AppLayout";
import GameList from "./ui/GameList";
import GameDetails from "./pages/GameDetails";
import Favorites from "./pages/Favorites";
import { getStores } from "./api/gamesApi";

function App() {
  const [stores, setStores] = useState([]);

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");

    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  function handleFavorites(game) {
    const isFavorite = favorites.some((favorite) => favorite.id === game.id);

    setFavorites((currentFavorites) => {
      if (isFavorite) {
        return currentFavorites.filter((favorite) => favorite.id !== game.id);
      }

      return [...currentFavorites, game];
    });
  }

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    async function fetchStores() {
      try {
        const data = await getStores();
        setStores(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchStores();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout
              favorites={favorites}
              handleFavorites={handleFavorites}
            />
          }
        >
          <Route
            index
            element={
              <GameList
                favorites={favorites}
                handleFavorites={handleFavorites}
              />
            }
          />
          <Route
            path="/game/:gameId"
            element={
              <GameDetails
                favorites={favorites}
                handleFavorites={handleFavorites}
                stores={stores}
              />
            }
          />
          <Route
            path="favorites"
            element={
              <Favorites
                favorites={favorites}
                handleFavorites={handleFavorites}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
