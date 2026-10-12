import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getGameDetails,
  getGameScreenshots,
  getGameStores,
} from "../api/gamesApi";

import favIcon from "../images/fav.png";
import notFavIcon from "../images/not-fav.png";
import Toast from "../ui/Toast";

function GameDetails({ favorites, handleFavorites, stores: allStores }) {
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [activeScreenshot, setActiveScreenshot] = useState(null);
  const [stores, setStores] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const { gameId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameId || isNaN(Number(gameId))) {
      console.log("Invalid gameId:", gameId);
      return;
    }

    async function fetchGame() {
      try {
        setLoading(true);
        setError("");

        const data = await getGameDetails(gameId);
        setGame(data);

        const screenshotsData = await getGameScreenshots(gameId);
        setScreenshots(screenshotsData);
        setActiveScreenshot(screenshotsData[0] || null);

        const storesData = await getGameStores(gameId);
        setStores(storesData);
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (!selectedScreenshot) return;

      const currentIndex = screenshots.findIndex(
        (screenshot) => screenshot.id === selectedScreenshot.id,
      );

      if (event.key === "Escape") {
        setSelectedScreenshot(null);
      }

      if (event.key === "ArrowLeft") {
        const previousIndex =
          currentIndex === 0 ? screenshots.length - 1 : currentIndex - 1;

        setSelectedScreenshot(screenshots[previousIndex]);
      }

      if (event.key === "ArrowRight") {
        const nextIndex =
          currentIndex === screenshots.length - 1 ? 0 : currentIndex + 1;

        setSelectedScreenshot(screenshots[nextIndex]);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedScreenshot, screenshots]);

  function handlePreviousScreenshot() {
    const currentIndex = screenshots.findIndex(
      (screenshot) => screenshot.id === selectedScreenshot.id,
    );
    const previousIndex =
      currentIndex === 0 ? screenshots.length - 1 : currentIndex - 1;
    setSelectedScreenshot(screenshots[previousIndex]);
  }

  function handleNextScreenshot() {
    const currentIndex = screenshots.findIndex(
      (screenshot) => screenshot.id === selectedScreenshot.id,
    );
    const nextIndex =
      currentIndex === screenshots.length - 1 ? 0 : currentIndex + 1;
    setSelectedScreenshot(screenshots[nextIndex]);
  }

  useEffect(() => {
    if (selectedScreenshot) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedScreenshot]);

  return (
    <>
      {loading && (
        <p className="py-10 text-center text-xl text-gray-500">
          Loading game... ⏳
        </p>
      )}
      {error && (
        <>
          <Link
            to="/"
            className="cursor-pointer text-2xl font-medium transition-all duration-300 ease-in-out hover:scale-[1.04]"
          >
            ⮌ Back to home
          </Link>
          <p className="py-10 text-center text-xl text-gray-500">{error}</p>
        </>
      )}
      {!loading && !error && game && (
        <>
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer text-2xl font-medium transition-all duration-300 ease-in-out hover:scale-[1.04]"
          >
            ⮌ Go back
          </button>

          <div className="mt-4 w-full max-w-5xl rounded-xl bg-white p-5 shadow-sm">
            <h1 className="mb-6 text-3xl font-bold"> {game.name} </h1>

            <div className="flex flex-col gap-8 md:flex-row md:gap-6">
              <div className="h-80 w-full shrink-0 sm:h-96 md:h-96 md:w-72">
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col justify-center gap-3 text-xl">
                <div>
                  <span className="pr-2 font-semibold"> Publisher: </span>
                  <span>
                    {game.publishers
                      ?.map((publisher) => publisher.name)
                      .join(", ") || "Unknown"}
                  </span>
                </div>

                <div>
                  <span className="pr-2 font-semibold"> Genre: </span>
                  <span>
                    {game.genres?.map((genre) => genre.name).join(", ") ||
                      "Unknown"}
                  </span>
                </div>

                <div>
                  <span className="pr-2 font-semibold"> Release: </span>
                  <span>
                    {game.released
                      ? new Date(game.released).getFullYear()
                      : "Unknown"}
                  </span>
                </div>

                <div>
                  <span className="pr-2 font-medium"> Rating: </span>
                  <span>⭐ {game.rating}</span>
                </div>

                <div>
                  <span className="pr-2 font-semibold"> Metacritic: </span>
                  <span>{game.metacritic ?? "N/A"}</span>
                </div>

                <div>
                  <span className="pr-2 font-semibold"> Age Rating: </span>
                  <span> {game.esrb_rating?.name || "Not Rated"} </span>
                </div>

                <div>
                  <span className="pr-2 font-semibold"> Playtime: </span>
                  <span>
                    {game.playtime ? `${game.playtime} hours` : "Unknown"}
                  </span>
                </div>

                <div>
                  <span className="pr-2 font-semibold"> Platforms: </span>
                  <span>
                    {game.platforms
                      ?.map((item) => item.platform.name)
                      .join(", ") || "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => {
                  const isFavorite = favorites.some(
                    (favorite) => favorite.id === game.id,
                  );

                  handleFavorites(game);

                  setToast({
                    gameName: game.name,
                    type: isFavorite ? "remove" : "success",
                  });
                }}
                className="-mt-2 w-fit rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-base font-medium transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:bg-gray-200 hover:shadow-md sm:text-xl"
              >
                <div className="flex items-center gap-2">
                  <img
                    className="h-5 w-5"
                    src={
                      favorites.some((favorite) => favorite.id === game.id)
                        ? favIcon
                        : notFavIcon
                    }
                  />
                  {favorites.some((favorite) => favorite.id === game.id)
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </div>
              </button>

              <div className="mt-5">
                <h2 className="mb-3 text-2xl font-semibold">Description</h2>
              </div>

              <p className="leading-relaxed text-gray-600">
                {game.description_raw || "No description available."}{" "}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="mb-4 text-2xl font-semibold">Tags</h2>

              {game.tags?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {game.tags?.slice(0, 11).map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-indigo-100 hover:text-indigo-600"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tags available.</p>
              )}
            </div>

            <div className="mt-10">
              <h2 className="mb-4 text-2xl font-semibold">Where to Buy</h2>

              {stores.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {stores.map((item) => {
                    const store = allStores.find(
                      (store) => store.id === item.store_id,
                    );

                    return (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 font-medium transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-md"
                      >
                        <span>{store?.name || "Unknown Store"}</span>
                        <span className="ml-2">🡭</span>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No stores available.</p>
              )}
            </div>

            <div className="mt-10">
              <h2 className="mb-4 text-2xl font-semibold">Screenshots</h2>
              {screenshots.length > 0 ? (
                <>
                  <button
                    onClick={() => setSelectedScreenshot(activeScreenshot)}
                    className="block w-full cursor-pointer overflow-hidden rounded-xl"
                  >
                    <img
                      src={activeScreenshot?.image}
                      alt={`${game.name} screenshot`}
                      className="h-56 w-full object-cover transition-all duration-300 hover:scale-[1.02] sm:h-72 md:h-96"
                    />
                  </button>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {screenshots.map((screenshot) => (
                      <button
                        key={screenshot.id}
                        onClick={() => {
                          setActiveScreenshot(screenshot);
                          setSelectedScreenshot(screenshot);
                        }}
                        className={`cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 ${activeScreenshot?.id === screenshot.id ? "border-indigo-500" : "border-transparent"}`}
                      >
                        <img
                          src={screenshot.image}
                          alt={`${game.name} screenshot`}
                          className="h-28 w-full object-cover transition-all duration-300 hover:scale-105"
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-500"> No screenshots available. </p>
              )}
            </div>
          </div>
        </>
      )}

      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="relative flex w-full max-w-6xl items-center justify-center gap-2 sm:gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handlePreviousScreenshot}
              className="cursor-pointer px-2 text-3xl text-white transition-all duration-200 hover:scale-110 sm:text-5xl"
            >
              ‹
            </button>

            <img
              src={selectedScreenshot.image}
              alt={`${game.name} screenshot`}
              className="max-h-[80vh] max-w-[75vw] rounded-xl object-contain shadow-2xl sm:max-h-[85vh] sm:max-w-[80vw]"
            />

            <button
              onClick={handleNextScreenshot}
              className="cursor-pointer px-2 text-3xl text-white transition-all duration-200 hover:scale-110 sm:text-5xl"
            >
              ›
            </button>

            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute -top-4 -right-7 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-zinc-800 text-xl font-bold text-white shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Close screenshot"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          gameName={toast.gameName}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
export default GameDetails;
