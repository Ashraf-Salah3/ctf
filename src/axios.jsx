import axios from "axios";
export const DEV_BASE_URL = "https://ctfchallenge.runasp.net";

const instance = axios.create({
  baseURL: DEV_BASE_URL + "/api/",
  headers: {
    "X-device": "web",
    "X-Language": localStorage.lang,
    "X-Portal": "patient",
    Accept: "application/json; charset=utf-8",
    "Accept-Language": localStorage.lang,
    "Content-Type": "application/json; charset=utf-8",
    ...(localStorage.getItem("medtoken") ? { Authorization: `Bearer ${localStorage.getItem("medtoken")}` } : {}),
  }
});

export const devInstance = axios.create({
  baseURL: DEV_BASE_URL + "/api",
  headers: {
    // "X-Language": strings.getLanguage() === "arabic" ? "ar" : "en",
    "X-device": "web",
    "X-Language": localStorage.lang,
    "X-Portal": "patient",
    Accept: "application/json; charset=utf-8",
    "Accept-Language": localStorage.lang,
    "Content-Type": "application/json; charset=utf-8",
  },
});

const handleUnauthorizedResponse = () => {
  // Clear user authentication tokens or take necessary actions
  localStorage.removeItem('medtoken');
  instance
  .post(`logout`, {})
  .then(() => {
    console.log("Logged out");
  })
  .catch((e) => console.error(e.response.data.message));
}

// Add a response interceptor
instance.interceptors.response.use(
  response => {
    // If the request is successful, return the response
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // If the error status is 401, handle the unauthorized response
      handleUnauthorizedResponse();
    }
    // Reject any other errors so they can be handled elsewhere
    return Promise.reject(error);
  }
);
// instance.interceptors.request.use((req) => {
//   console.log(`${req.method} ${req.url}`);
//   // Important: request interceptors **must** return the request.
//   return req;
// });
// instance.interceptors.response.use(
//   (res) => {
//     return res;
//   },
//   (err) => {
//     if (err && err.response && err.response.data.message) {
//       if (err.response.status == 403 && err.response.config.url != "/login") {
//         window.localStorage.removeItem("persist:root");
//         toast(strings.unAuth, {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           type: "error",
//           onClose: () => {
//             window.location.replace("/");
//           },
//         });
//       } else if (
//         err.response.status == 401 &&
//         err.response.config.url != "/login" &&
//         err.response.config.url != "/social/login"
//       ) {
//         window.localStorage.removeItem("persist:root");
//         toast(strings.unAuth2, {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           type: "error",
//           onClose: () => {
//             window.location.replace("/auth/login");
//           },
//         });
//       } else return Promise.reject(err);
//     }
//     // Important: response interceptors **must** return the response.
//     // return err;
//   }
// );
export default instance;
