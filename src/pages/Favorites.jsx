import GameCard from "../ui/GameCard";
import ToolsBar from "../ui/ToolsBar";
import useGameFilters from "../hooks/useGameFilters";
import { sortGames } from "../utils/gameUtils";

function Favorites({ favorites, handleFavorites }) {
  const {
    searchInput,
    categorySelected,
    sortOption,
    setSearch,
    setCategory,
    setSort,
  } = useGameFilters();

  const filteredGames = favorites.filter((game) => {
    const matchesSearch = game.name
      .toLowerCase()
      .includes(searchInput.trim().toLowerCase());

    const matchesCategory =
      !categorySelected ||
      game.genres?.some((genre) => genre.slug === categorySelected);

    return matchesSearch && matchesCategory;
  });

  const sortedGames = sortGames(filteredGames, sortOption);

  return (
    <div className="px-2">
      <h2 className="pb-2 pl-2 text-3xl">Your Favorite Games</h2>

      <ToolsBar
        searchInput={searchInput}
        setSearchInput={setSearch}
        categorySelected={categorySelected}
        setCategorySelected={setCategory}
        sortOption={sortOption}
        setSortOption={setSort}
      />

      {sortedGames.length > 0 ? (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5 py-7">
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
      ) : favorites.length === 0 ? (
        <p className="py-10 text-center text-xl text-gray-500">
          No favorite games yet 😢
        </p>
      ) : (
        <p className="py-10 text-center text-xl text-gray-500">
          No games match your search/filter. 🔍
        </p>
      )}
    </div>
  );
}

export default Favorites;
