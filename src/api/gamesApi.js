const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

export async function getGames(
  page = 1,
  pageSize = 20,
  search = "",
  signal,
  genre = "",
) {
  const params = new URLSearchParams({
    key: API_KEY,
    page: String(page),
    page_size: String(pageSize),
  });

  if (search) {
    params.set("search", search);
  }

  if (genre) {
    params.set("genres", genre);
  }

  // const searchParams = search ? `&search=${encodeURIComponent(search)}` : "";

  const response = await fetch(
    `https://api.rawg.io/api/games?${params.toString()}`,
    { signal },
  );

  // const response = await fetch(
  //   `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=${pageSize}${searchParams}`,
  //   { signal },
  // );

  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }

  const data = await response.json();
  return {
    games: data.results,
    next: data.next,
    previous: data.previous,
    count: data.count,
  };
}

export async function getGameDetails(gameId) {
  const response = await fetch(
    `https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch game details");
  }

  return response.json();
}

export async function getGameScreenshots(gameId) {
  const response = await fetch(
    `https://api.rawg.io/api/games/${gameId}/screenshots?key=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch game screenshots");
  }

  const data = await response.json();

  return data.results;
}

export async function getGameStores(gameId) {
  const response = await fetch(
    `https://api.rawg.io/api/games/${gameId}/stores?key=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch game stores");
  }

  const data = await response.json();

  return data.results;
}

export async function getStores() {
  const response = await fetch(`https://api.rawg.io/api/stores?key=${API_KEY}`);

  if (!response.ok) {
    throw new Error("Failed to fetch stores");
  }

  const data = await response.json();

  return data.results;
}
