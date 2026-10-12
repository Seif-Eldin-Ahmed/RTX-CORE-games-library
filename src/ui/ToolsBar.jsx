function ToolsBar({
  searchInput,
  setSearchInput,
  categorySelected,
  setCategorySelected,
  sortOption,
  setSortOption,
}) {
  const categories = [
    { label: "All", value: "" },
    { label: "Action", value: "action" },
    { label: "RPG", value: "role-playing-games-rpg" },
    { label: "Sports", value: "sports" },
    { label: "Racing", value: "racing" },
  ];

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "title-a-z", label: "Title A-Z" },
    { value: "title-z-a", label: "Title Z-A" },
    { value: "rating-high", label: "Rating High-Low" },
    { value: "rating-low", label: "Rating Low-High" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <input
        type="search"
        className="w-full rounded-lg bg-gray-200 px-3 py-2 transition outline-none focus:ring-2 focus:ring-indigo-400 lg:w-1/3"
        placeholder="Search Games..."
        aria-label="Search games"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <ul className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <li key={category.value || "all"}>
            <button
              type="button"
              aria-pressed={categorySelected === category.value}
              className={`rounded-lg px-3 py-2 text-base font-medium transition ${
                categorySelected === category.value
                  ? "bg-yellow-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setCategorySelected(category.value)}
            >
              {category.label}
            </button>
          </li>
        ))}
      </ul>

      <select
        className="w-full cursor-pointer rounded-lg bg-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 lg:ml-auto lg:w-auto"
        aria-label="Sort games"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        {sortOptions.map((option) => (
          <option
            value={option.value}
            key={option.value}
            className="bg-gray-800 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ToolsBar;
