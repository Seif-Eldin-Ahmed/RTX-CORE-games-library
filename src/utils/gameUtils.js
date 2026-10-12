export function sortGames(games, sortOption) {
  const sortedGames = [...games];

  switch (sortOption) {
    case "title-a-z":
      sortedGames.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case "title-z-a":
      sortedGames.sort((a, b) => b.name.localeCompare(a.name));
      break;

    case "rating-high":
      sortedGames.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
      break;

    case "rating-low":
      sortedGames.sort(
        (a, b) => (a.rating ?? Infinity) - (b.rating ?? Infinity),
      );
      break;

    case "newest":
      sortedGames.sort((a, b) => {
        if (!a.released) return 1;
        if (!b.released) return -1;

        return new Date(b.released) - new Date(a.released);
      });
      break;

    case "oldest":
      sortedGames.sort((a, b) => {
        if (!a.released) return 1;
        if (!b.released) return -1;

        return new Date(a.released) - new Date(b.released);
      });
      break;
  }

  return sortedGames;
}
