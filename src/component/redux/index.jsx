import { configureStore } from "@reduxjs/toolkit";
import challengeReducer from "./challengeSlice";
import notificationReducer from "./NotificationSlice";
import competationReducer from "./competationSlice";
import submissionReducer from "./submissionSlice";
import usersReducer from "./usersSlice";
import fetchCompetitionSliceReducer from "./fetchCompetitionSlice";
import checkUserReducer from "./checkUserSlice";
const store = configureStore({
  reducer: {
    challenge: challengeReducer,
    notification: notificationReducer,
    competation: competationReducer,
    submission: submissionReducer,
    users: usersReducer,
    fetchCompetition: fetchCompetitionSliceReducer,
    checkUsers: checkUserReducer
  },
});

export default store;
