import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../axios";


const initialState = {
  notifications: [],
  notificationStatus: null,
  notificationFilter: {
    CategoryId: null,
    PageIndex: 1,
    PageSize: 10,
    UserId: null,
    Status: null,
    CompetationId: null,
  },
};

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotification",
  async (notificationFilter, { rejectWithValue }) => {
    const filter = { ...notificationFilter };
    try {
      const response = await instance.get("Notification", { params: filter });
      return response.data.data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationFilter: (state, action) => {
      state.notificationFilter = {
        ...state.notificationFilter,
        ...action.payload,
      };
    },
  },
  extraReducers: (bulider) => {
    bulider
      .addCase(fetchNotifications.pending, (state) => {
        state.notificationStatus = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notificationStatus = "succeeded";
        const { items = [], count = 0 } = action.payload;
        state.notifications = items;
        state.totalPages = Math.ceil(count / state.notificationFilter.PageSize);
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.notificationStatus = "failed";
      });
  },
});

export const { setNotificationFilter } = notificationSlice.actions;
export default notificationSlice.reducer;
