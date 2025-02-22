import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../axios";

const initialState = {
  challengesCompitation: [],
  competitionStatus: null,
  competitionIsStarted: false,
  competitionIsEnded: false,
  competitionState: null,
};

export const fetchCompetitionById = createAsyncThunk(
  "fetchCompetitionById/check",
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.get(`Competation/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchCompetitionSlice = createSlice({
  name: "checkCompetation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompetitionById.pending, (state) => {
        state.competitionStatus = "loading";
        state.competitionIsStarted = false;
      })
      .addCase(fetchCompetitionById.fulfilled, (state, action) => {
        state.competitionState = action.payload.data;
        if (action.payload.statusCode === 400) {
          state.competitionIsEnded === true;
        }
        if (action.payload.statusCode === 200) {
          state.competitionIsStarted = true;
          state.competitionStatus = "succeeded";
          const { challenges = [] } = action.payload.data;
          state.challengesCompitation = challenges;
        } else {
          state.competitionIsStarted = false;
          state.challengesCompitation = [];
        }
      })
      .addCase(fetchCompetitionById.rejected, (state) => {
        state.competitionStatus = "failed";
        state.competitionIsStarted = false;
        state.challengesCompitation = [];
      });
  },
});

export default fetchCompetitionSlice.reducer;
