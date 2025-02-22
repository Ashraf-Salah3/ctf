
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../axios";
const nameIdentifier = localStorage.getItem("nameIdentifier");
const initialState = {
  users: [],
  userStatus: null,
  userFilter: {
    PageIndex: 1,
    PageSize: 10,
    SearchName: "",
  },
  totalPages: 0,
  user:{}
  };


  export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async (userFilter, { rejectWithValue }) => {
      const filter = { ...userFilter };
      try {
        const response = await instance.get("Account", {
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
  

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`Account/${nameIdentifier}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUserFilter: (state, action) => {
      state.userFilter = { ...state.userFilter, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.userStatus = "succeeded";
        const { items = [], count = 0 } = action.payload;
        state.users = items;
        state.totalPages = Math.ceil(count / state.userFilter.PageSize);
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.userStatus = "failed";
      })
      .addCase(fetchUserById.fulfilled, (state,action) => {
        state.user = action.payload;
      })
  },
});

export const { setUserFilter } = usersSlice.actions;
export default usersSlice.reducer;
