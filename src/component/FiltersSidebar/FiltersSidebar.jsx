import { IoIosSearch } from "react-icons/io";
import styles from "./filter-sidbar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import { setChallengeFilter } from "../redux/challengeSlice";

const FiltersSidebar = () => {
  const [searchText, setSearchText] = useState("");
  const { challengeFilter, categories } = useSelector(
    (state) => state.challenge
  );
  const [activeCategory, setActiveCategory] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (challengeFilter.CategoryId) {
      setActiveCategory(challengeFilter.CategoryId);
    }
  }, [challengeFilter]);

  const handleSearchChange = (event) => {
    const updatedFilter = {
      ...challengeFilter,
      SearchName: event.target.value || null,
    };
    setSearchText(event.target.value);
    dispatch(setChallengeFilter(updatedFilter));
  };

  const handleCategoryChange = useCallback(
    (id) => {
      setActiveCategory(id);
      const updatedFilter = {
        ...challengeFilter,
        CategoryId: id,
      };
      dispatch(setChallengeFilter(updatedFilter));
    },
    [challengeFilter, dispatch]
  );

  const handleSolvedChange = () => {
    const updatedFilter = {
      ...challengeFilter,
      IsSolved: challengeFilter.IsSolved === true ? null : true,
    };
    dispatch(setChallengeFilter(updatedFilter));
  };

  const handleUnsolvedChange = () => {
    const updatedFilter = {
      ...challengeFilter,
      IsSolved: challengeFilter.IsSolved === false ? null : false,
    };
    dispatch(setChallengeFilter(updatedFilter));
  };

  const handleDifficultyChange = (level) => {
    const updatedFilter = {
      ...challengeFilter,
      Level: challengeFilter.Level === level ? null : level,
    };
    dispatch(setChallengeFilter(updatedFilter));
  };

  return (
    <div className={styles.sidebar}>
      <h3>Filters</h3>

      {/* Solved/Unsolved Filter */}
      <div className={styles["checkbox-input"]}>
        <label htmlFor="solved">
          <input
            type="checkbox"
            id="solved"
            name="solved"
            checked={challengeFilter.IsSolved === true}
            onChange={handleSolvedChange}
          />
          Solved
        </label>
        <label htmlFor="unsolved">
          <input
            type="checkbox"
            id="unsolved"
            name="unsolved"
            checked={challengeFilter.IsSolved === false}
            onChange={handleUnsolvedChange}
          />
          Unsolved
        </label>
      </div>

      {/* Search Filter */}
      <div className={styles.search}>
        <IoIosSearch />
        <input
          className="--input"
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search by Name"
        />
      </div>

      {/* Difficulty Filter */}
      <div className={styles["checkbox-input"]}>
        <h4>Difficulty</h4>
        {["Easy", "Medium", "Hard"].map((level) => (
          <label key={level}>
            <input
              type="checkbox"
              id={level.toLowerCase()}
              name="difficulty"
              value={level}
              checked={challengeFilter.Level === level}
              onChange={() => handleDifficultyChange(level)}
            />
            {level}
          </label>
        ))}
      </div>

      {/* Categories Filter */}
      <div className={styles.ChallengeCategory}>
        <h4>Categories</h4>
        <ul>
          <li
            className={`${styles.categoryFilter} ${
              activeCategory === null ? styles.active : ""
            }`}
            onClick={() => handleCategoryChange(null)}
          >
            All Categories
          </li>
          {categories?.map((category) => (
            <li
              key={category.id}
              className={`${styles.categoryFilter} ${
                activeCategory === category.id ? styles.active : ""
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category?.name?.toUpperCase()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FiltersSidebar;
