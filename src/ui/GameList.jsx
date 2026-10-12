import { useEffect, useState } from "react";

import { getGames } from "../api/gamesApi";
import { sortGames } from "../utils/gameUtils";
import useGameFilters from "../hooks/useGameFilters";

import GameCard from "./GameCard";
import ToolsBar from "./ToolsBar";
import Toast from "./Toast";

function GameList({ favorites, handleFavorites }) {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearchTerm] = useState("");

  const [toast, setToast] = useState(null);
  const [failedPage, setFailedPage] = useState(null);
  const [requestKey, setRequestKey] = useState(0);

  const {
    searchInput,
    categorySelected,
    sortOption,
    setSearch,
    setCategory,
    setSort,
  } = useGameFilters();

  function showToast(toastData) {
    setToast(toastData);
  }

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      const newSearch = searchInput.trim();

      if (newSearch !== search) {
        setSearchTerm(newSearch);
        setPage(1);
        setGames([]);
        setHasMore(true);
        setError("");
        setFailedPage(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, search]);

  // Reset results when category changes
  function handleCategoryChange(value) {
    if (value === categorySelected) return;

    setCategory(value);
    setPage(1);
    setGames([]);
    setHasMore(true);
    setError("");
    setFailedPage(null);
  }

  // Fetch games from RAWG API
  useEffect(() => {
    const controller = new AbortController();

    async function loadGames() {
      try {
        setLoading(true);
        setError("");

        const genre = categorySelected;

        const data = await getGames(page, 20, search, controller.signal, genre);

        setGames((prevGames) => {
          if (page === 1) {
            return data.games;
          }

          // Avoid duplicate games between pages
          const uniqueGames = new Map(prevGames.map((game) => [game.id, game]));

          data.games.forEach((game) => {
            if (!uniqueGames.has(game.id)) {
              uniqueGames.set(game.id, game);
            }
          });

          return Array.from(uniqueGames.values());
        });

        setHasMore(Boolean(data.next));
        setFailedPage(null);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error(error);
        setError(error.message || "Failed to fetch games");
        setFailedPage(page);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadGames();

    return () => {
      controller.abort();
    };
  }, [page, search, categorySelected, requestKey]);

  function handleLoadMore() {
    if (loading) return;

    if (failedPage !== null) {
      // Retry the same failed page
      setRequestKey((prev) => prev + 1);
      return;
    }

    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }

  const sortedGames = sortGames(games, sortOption);

  return (
    <>
      {toast && (
        <Toast
          gameName={toast.gameName}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="px-2">
        <h2 className="pb-2 pl-2 text-3xl">All Games</h2>

        <ToolsBar
          searchInput={searchInput}
          setSearchInput={setSearch}
          categorySelected={categorySelected}
          setCategorySelected={handleCategoryChange}
          sortOption={sortOption}
          setSortOption={setSort}
        />

        {loading && games.length === 0 ? (
          <p className="py-10 text-center text-xl text-gray-500">
            Loading games... ⏳
          </p>
        ) : (
          <>
            {error && <p className="py-4 text-center text-red-500">{error}</p>}

            {sortedGames.length > 0 ? (
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
                        onFavoriteChange={showToast}
                      />
                    </li>
                  ))}
                </ul>

                {hasMore && (
                  <div className="flex justify-center py-5">
                    <button
                      className="rounded-lg bg-indigo-500 px-5 py-2 text-lg font-medium text-indigo-50 transition-all duration-300 ease-in-out hover:bg-indigo-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={handleLoadMore}
                      disabled={loading}
                    >
                      {loading
                        ? "Loading... ⏳"
                        : failedPage !== null
                          ? "Retry loading"
                          : "Load More"}
                    </button>
                  </div>
                )}
              </>
            ) : !error && !loading ? (
              <p className="py-10 text-center text-xl text-gray-500">
                No games match your search/filter. 🔍
              </p>
            ) : null}

            {error && games.length === 0 && !loading && (
              <div className="flex justify-center pb-5">
                <button
                  onClick={() => setRequestKey((prev) => prev + 1)}
                  className="rounded-lg bg-indigo-500 px-5 py-2 font-medium text-white transition hover:bg-indigo-600"
                >
                  Try again
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default GameList;
