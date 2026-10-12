import { useReducer } from "react";

const initialState = {
  searchInput: "",
  categorySelected: "",
  sortOption: "default",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH":
      return {
        ...state,
        searchInput: action.payload,
      };

    case "SET_CATEGORY":
      return {
        ...state,
        categorySelected: action.payload,
      };

    case "SET_SORT":
      return {
        ...state,
        sortOption: action.payload,
      };

    default:
      return state;
  }
}

function useGameFilters() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function setSearch(value) {
    dispatch({
      type: "SET_SEARCH",
      payload: value,
    });
  }

  function setCategory(value) {
    dispatch({
      type: "SET_CATEGORY",
      payload: value,
    });
  }

  function setSort(value) {
    dispatch({
      type: "SET_SORT",
      payload: value,
    });
  }

  return {
    searchInput: state.searchInput,
    categorySelected: state.categorySelected,
    sortOption: state.sortOption,
    setSearch,
    setCategory,
    setSort,
  };
}

export default useGameFilters;
