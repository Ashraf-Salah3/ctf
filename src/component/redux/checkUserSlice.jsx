import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../axios";


const initialState = {
  userInteam: null,
  compitationId: null,
  userIsInCompetition: null,
  userStatus: null,
  userIsInCompetitionStatus: null,
};

export const checkUserInTeam = createAsyncThunk(
  "CheckUser/check",
  async (id, { rejectWithValue }) => {
    const nameIdentifier = localStorage.getItem("nameIdentifier");
    try {
      const response = await instance.get("Team/checkmember", {
        params: {
          userId: nameIdentifier,
          competationId: id,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkUserInCompetition = createAsyncThunk(
  "checkUserInCompetition/checkUser",
  async (_, { rejectWithValue }) => {
    const nameIdentifier = localStorage.getItem("nameIdentifier");
    try {
      const response = await instance.get(
        `Competation/check/${nameIdentifier}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const checkUserSlice = createSlice({
  name: "checkUser",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(checkUserInTeam.fulfilled, (state, action) => {
        state.userStatus = "success";
        if (action.payload.status === true) {
          state.userInteam = true;
        } else {
          state.userInteam = false;
        }
      })
      .addCase(checkUserInTeam.rejected, (state) => {
        state.userStatus = "failed";
        state.userInteam = false;
      })
      .addCase(checkUserInCompetition.pending, (state) => {
        state.userIsInCompetitionStatus = "loading";
      })
      .addCase(checkUserInCompetition.fulfilled, (state, action) => {
        if (action.payload?.statusCode === 200) {
          state.userIsInCompetitionStatus = "success";
          state.compitationId = action.payload.data?.competationId || null;
          state.userIsInCompetition = true;
        } else {
          state.userIsInCompetitionStatus = "failed";
          state.userIsInCompetition = false;
          state.compitationId = null;
        }
      })
      .addCase(checkUserInCompetition.rejected, (state) => {
        state.userIsInCompetitionStatus = "failed";
        state.userIsInCompetition = false;
        state.compitationId = null;
      });
  },
});

export default checkUserSlice.reducer;