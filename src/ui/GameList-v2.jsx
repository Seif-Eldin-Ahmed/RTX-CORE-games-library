import { useEffect, useState } from "react";
import { getGames } from "../api/gamesApi";
import GameCard from "./GameCard";
import ToolsBar from "./ToolsBar";

function GameList({ favorites, handleFavorites }) {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [categorySelected, setCategorySelected] = useState("All");
  const [sortOption, setSortOption] = useState("default");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  async function fetchGames(pageNumber, searchTerm) {
    try {
      setLoading(true);
      setError("");

      const data = await getGames(pageNumber, 20, searchTerm);

      setGames((prevGames) =>
        pageNumber === 1 ? data.games : [...prevGames, ...data.games],
      );

      setHasMore(Boolean(data.next));
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGames(page, search);
  }, [page, search]);

  function handleLoadMore() {
    setPage((prevPage) => prevPage + 1);
  }

  const filteredGames = games.filter(
    (game) =>
      categorySelected === "All" ||
      game.genres.some((genre) => genre.name === categorySelected),
  );

  const sortedGames = [...filteredGames];

  switch (sortOption) {
    case "title-a-z":
      sortedGames.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case "title-z-a":
      sortedGames.sort((a, b) => b.name.localeCompare(a.name));
      break;

    case "rating-high":
      sortedGames.sort((a, b) => b.rating - a.rating);
      break;

    case "rating-low":
      sortedGames.sort((a, b) => a.rating - b.rating);
      break;

    case "newest":
      sortedGames.sort((a, b) => new Date(b.released) - new Date(a.released));
      break;

    case "oldest":
      sortedGames.sort((a, b) => new Date(a.released) - new Date(b.released));
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

      {loading && games.length === 0 ? (
        <p className="py-10 text-center text-xl text-gray-500">
          Loading games... ⏳
        </p>
      ) : error ? (
        <p className="py-10 text-center text-xl text-gray-500">{error}</p>
      ) : sortedGames.length > 0 ? (
        <>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-x-5 gap-y-6 py-7">
            {sortedGames.map((game) => (
              <li key={game.id}>
                <GameCard
                  game={game}
                  handleFavorites={handleFavorites}
                  isFavorite={favorites.some(
                    (favorite) => favorite.id === game.id,
                  )}
                />
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className="flex justify-center py-5">
              <button
                className="rounded-lg bg-blue-500 px-6 py-3 text-lg font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? "Loading... ⏳" : "Load More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="py-10 text-center text-xl text-gray-500">
          No games match your search/filter. 🔍
        </p>
      )}
    </div>
  );
}

export default GameList;
