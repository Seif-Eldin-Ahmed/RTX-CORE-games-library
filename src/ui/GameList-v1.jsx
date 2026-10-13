import { useState } from "react";
import { games } from "../data/data";
import GameCard from "./GameCard";
import ToolsBar from "./ToolsBar";

function GameList({ favorites, handleFavorites }) {
  const [searchInput, setSearchInput] = useState("");
  const [categorySelected, setCategorySelected] = useState("All");
  const [sortOption, setSortOption] = useState("default");

  const filteredGames = games.filter(
    (game) =>
      game.title.toLowerCase().includes(searchInput.toLowerCase()) &&
      (categorySelected === "All" || game.genre === categorySelected),
  );

  const sortedGames = [...filteredGames];

  switch (sortOption) {
    case "title-a-z":
      sortedGames.sort((a, b) => a.title.localeCompare(b.title));
      break;

    case "title-z-a":
      sortedGames.sort((a, b) => b.title.localeCompare(a.title));
      break;

    case "rating-high":
      sortedGames.sort((a, b) => b.rating - a.rating);
      break;

    case "rating-low":
      sortedGames.sort((a, b) => a.rating - b.rating);
      break;

    case "newest":
      sortedGames.sort((a, b) => b.publishYear - a.publishYear);
      break;

    case "oldest":
      sortedGames.sort((a, b) => a.publishYear - b.publishYear);
      break;
  }

  return (
    <div className="px-2">
      <h2 className="pb-2 pl-2 text-3xl">All Games</h2>

      <ToolsBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        categorySelected={categorySelected}
        setCategorySelected={setCategorySelected}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* <ul className="grid grid-cols-1 gap-5 py-7 md:grid-cols-2 xl:grid-cols-5"> */}
      {sortedGames.length > 0 ? (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5 py-7">
          {sortedGames.map((game) => (
            <li key={game.id}>
              <GameCard
                game={game}
                handleFavorites={handleFavorites}
                isFavorite={favorites.includes(game.id)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-xl text-gray-500">
          No games match your search/filter. 🔍
        </p>
      )}
    </div>
  );
}

export default GameList;
