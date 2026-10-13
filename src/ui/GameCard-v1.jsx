import { Link } from "react-router-dom";

function GameCard({ game, handleFavorites, isFavorite }) {
  return (
    <div className="mb-5 w-full overflow-hidden rounded-xl bg-white">
      <Link to={`/game/${game.id}`}>
        <img
          src={game.image}
          alt={game.title}
          className="h-52 w-full object-cover"
        />

        <div className="p-2">
          <h2 className="leading-tight font-medium">{game.title}</h2>

          <div className="flex gap-2">
            <span>{game.genre}</span>•<span>{game.publishYear}</span>
          </div>

          <div className="flex items-center">
            <span>⭐{game.rating}</span>

            <button
              className="ml-auto cursor-pointer text-2xl"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFavorites(game);
              }}
            >
              {isFavorite ? (
                <img
                  className="h-5 w-5"
                  src="/src/images/fav.png"
                  alt="Remove from favorites"
                />
              ) : (
                <img
                  className="h-5 w-5"
                  src="/src/images/not-fav.png"
                  alt="Add to favorites"
                />
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default GameCard;
