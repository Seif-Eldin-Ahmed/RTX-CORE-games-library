import { Link } from "react-router-dom";

import favIcon from "../images/fav.png";
import notFavIcon from "../images/not-fav.png";

function GameCard({ game, handleFavorites, isFavorite, onFavoriteChange }) {
  function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();

    handleFavorites(game);

    onFavoriteChange({
      gameName: game.name,
      type: isFavorite ? "remove" : "success",
    });
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-white transition-all duration-300 ease-in-out hover:scale-[1.04]">
      <Link to={`/game/${game.id}`} className="flex h-full flex-col">
        <img
          src={game.background_image}
          alt={game.name}
          className="h-52 w-full object-cover"
        />

        <div className="flex flex-1 flex-col p-2">
          <h2 className="line-clamp-2 leading-tight font-medium">
            {game.name}
          </h2>

          <div className="flex gap-2">
            <span>
              {game.genres
                ?.slice(0, 2)
                .map((genre) => genre.name)
                .join(", ") || "Unknown"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>
              ⭐{" "}
              <span className="rounded-sm bg-gray-100 px-1">{game.rating}</span>
            </span>
            •
            <span className="rounded-sm bg-gray-100 px-1">
              {game.released
                ? new Date(game.released).getFullYear()
                : "Unknown"}
            </span>
          </div>

          <div className="mt-auto ml-auto flex items-center">
            <button
              className="cursor-pointer text-2xl"
              onClick={handleFavoriteClick}
            >
              <img
                className="h-5 w-5"
                src={isFavorite ? favIcon : notFavIcon}
                alt={isFavorite ? "Remove from favorites" : "Add to favorites"}
              />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default GameCard;
