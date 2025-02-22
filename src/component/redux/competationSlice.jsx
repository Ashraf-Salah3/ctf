import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../axios";

const initialState = {
  competations: [],
  competationStatus: null,
  competationFilter: {
    PageIndex: 1,
    PageSize: 12,
    Status: null,
    SearchName: "",
  },
  totalPages: 0,
  competationData: null,
};

export const fetchCompetations = createAsyncThunk(
  "competations/fetchCompetations",
  async (competationFilter, { rejectWithValue }) => {
    const filter = { ...competationFilter };
    try {
      const response = await instance.get("Competation", { params: filter });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const competationSlice = createSlice({
  name: "competation",
  initialState,
  reducers: {
    setCompetitionFilter: (state, action) => {
      state.competationFilter = {
        ...state.competationFilter,
        ...action.payload,
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCompetations.pending, (state) => {
        state.competationStatus = "loading";
      })
      .addCase(fetchCompetations.fulfilled, (state, action) => {
        state.competationStatus = "succeeded";
        const { items = [], count = 0 } = action.payload;
        state.competations = items;
        state.totalPages = Math.ceil(count / state.competationFilter.PageSize);
      })

      .addCase(fetchCompetations.rejected, (state) => {
        state.competationStatus = "failed";
      });
  },
});
export const { setCompetitionFilter } = competationSlice.actions;
export default competationSlice.reducer;
