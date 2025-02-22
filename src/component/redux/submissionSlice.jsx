import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../axios";

const initialState = {
  submissions: [],
  submissionStatus: null,
  submissionFilter: {
    Status: null,
    PageIndex: 1,
    PageSize: 10,
    UserId: null,
  },
  totalPages: 0,
  error: null,
};

export const fetchUsersSubmissions = createAsyncThunk(
  "submission/fetchSubmissions",
  async (submissionFilter, { rejectWithValue }) => {
    const filter = {...submissionFilter };
    try {
      const response = await instance.get(`Submission`, {
        params: filter,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const submissionSlice = createSlice({
  name: "submission",
  initialState,
  reducers: {
    setSubmissionFilter: (state, action) => {
      state.submissionFilter = { ...state.submissionFilter, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersSubmissions.pending, (state) => {
        state.submissionStatus = "loading";
      })
      .addCase(fetchUsersSubmissions.fulfilled, (state, action) => {
        state.submissionStatus = "succeeded";
        const { items = [], count = 0 } = action.payload;
        state.submissions = items;
        state.totalPages = Math.ceil(count / state.submissionFilter.PageSize);
      })
      .addCase(fetchUsersSubmissions.rejected, (state, action) => {
        state.submissionStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { setSubmissionFilter } = submissionSlice.actions;

export default submissionSlice.reducer;
