import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../axios";

// Initial state
const initialState = {
  challenges: [],
  challengeStatus: null,
  challengeFilter: {
    CategoryId: "",
    PageIndex: 1,
    PageSize: 16,
    SearchName: "",
    Status: "Visible",
    IsSolved: null,
    UserId: null,
    IsAccepted:null
  },
  totalPages: 0,
  categories: [],
  categoryStatus: null,
};

// Async thunk to fetch challenges
export const fetchChallenges = createAsyncThunk(
  "challenge/fetchChallenge",
  async (challengeFilter, { rejectWithValue }) => {
    const filter = { ...challengeFilter };
    try {
      const response = await instance.get("Challenge", { params: filter });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// Fetch categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("Category");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Challenge slice
const challengeSlice = createSlice({
  name: "challenge",
  initialState,
  reducers: {
    setChallengeFilter: (state, action) => {
        state.challengeFilter = { ...state.challengeFilter, ...action.payload };
    },
    resetCompetitionFilter: (state) => {
      state.challengeFilter.CompetitionId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch challenges
      .addCase(fetchChallenges.pending, (state) => {
        state.challengeStatus = "loading";
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.challengeStatus = "succeeded";
        const { items = [], count = 0 , pageSize=0} = action.payload;
        state.challenges = items;
        state.totalPages = Math.ceil(count / pageSize);
      })
      .addCase(fetchChallenges.rejected, (state) => {
        state.challengeStatus = "failed";
      })
      
      

      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoryStatus = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoryStatus = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categoryStatus = "failed";
      });
  },
});

export const { setChallengeFilter, resetCompetitionFilter } = challengeSlice.actions;
export default challengeSlice.reducer;
