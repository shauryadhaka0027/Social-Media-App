import axios from "axios";
import { ApiUrl } from "./apiRoutes";

// Fetch the API base URL from environment variables
export const apiUrl = import.meta.env.VITE_API;

// // Retrieve the token from localStorage
// let token = JSON.parse(localStorage.getItem("userData"));
// token = token ? token.login_token : null;

// Create an Axios instance
export const fetchApi = axios.create({
  baseURL: apiUrl,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


// Axios Interceptor to attach Authorization token
// fetchApi.interceptors.request.use((config) => {
//   const storedToken = JSON.parse(localStorage.getItem("userData") || "{}");
//   if (storedToken && storedToken.login_token) {
//     config.headers.Authorization = `Bearer ${storedToken.login_token}`;
//   }
//   return config;
// });

class FetchData {
  // Signup method
  async signup(data) {
    try {
      const response = await fetchApi.post(ApiUrl.auth.signupUser, data,{
        headers: { "Content-Type": "multipart/form-data" },
      }); // Pass JSON data directly
      return response.data;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  }

  // Upload user image
  async userImage(data) {
    try {
      const response = await fetchApi.post(ApiUrl.user.getUserProfile, data, {
        headers: { "Content-Type": "multipart/form-data" }, // Override content type for form-data
      });
      return response.data;
    } catch (error) {
      console.error("Error while uploading user image:", error);
      throw error;
    }
  }

  // Post user data
  async userPost(data) {
    try {
      const response = await fetchApi.post(ApiUrl.post.postUser, data,{
        headers: { "Content-Type": "multipart/form-data" },
      }); // Pass JSON data
      return response.data;
    } catch (error) {
      console.error("Error while posting user data:", error);
      throw error;
    }
  }

  // Create a user post
  async getUserPost(data) {
    try {
      const response = await fetchApi.post(ApiUrl.post.getUserPost, data,{
        headers: { "Content-Type": "multipart/form-data" }
      }); 
      return response.data;
    } catch (error) {
      console.error("Error while creating user post:", error);
      throw error;
    }
  }

  async getLikesPost(data) {
    try {
      const response = await fetchApi.post(ApiUrl.post.getLikesPost, data); // Pass JSON data
      return response.data;
    } catch (error) {
      console.error("Error while getting likes post:", error);
      throw error;
    }
  }

  async getCommentsPost(data) {
    try {
      const response = await fetchApi.post(ApiUrl.post.getCommentsPost,data, data); // Pass JSON data
      return response.data;
    } catch (error) {
      console.error("Error while getting comments post:", error);
      throw error;
    }
  }

  async getUserDetails(data){
    try {
      const response = await fetchApi.post(ApiUrl.user.getUserDetails,data,{
        "Content-Type": "application/json",
      }); // Pass JSON data
      return response.data;
    } catch (error) {
      console.error("Error while getting user details:", error);
      throw error;
    }
  }

  async userLogin(data){
    try {
      const response = await fetchApi.post(ApiUrl.auth.userLogin,data); // Pass JSON data
      return response.data;
    } catch (error) {
      console.error("Error while logging in:", error);
      throw error;
    }
  }

  async deleteUserPost(data){
    try {
      const response = await fetchApi.post(ApiUrl.post.deleteUserPost,data); // Pass JSON data
      return response.data;
    } catch (error) {
      console.error("Error while deleting user post:", error);
      throw error;
    }
  }

  async addFollowing(data){
    try {
      const response = await fetchApi.post(ApiUrl.user.addFollowing,data); // Pass JSON data
      return response.data;
    } catch (error) {
      console.error("Error while adding following:", error);
      throw error;
    }
  }

  async getUserDetailsById(data){
    try {
      const response = await fetchApi.post(ApiUrl.user.getUserById, data); // Pass JSON data
      return response.data;
    } catch (error) {
      console.error("Error while getting user details:", error);
      throw error;
    }
  }

  async userUnfollow(data){
    try {
      const response = await fetchApi.post(ApiUrl?.user?.userUnfollow,data); // Pass JSON data
      return response.data;
    } catch (error) {
      console.error("Error while unfollowing:", error);
      throw error;
    }
  }

  async updateUserProfile(data){
    try {
      const response = await fetchApi.patch(ApiUrl.user.userProfileUpdate,data)
      return response.data;
    } catch (error) {
      console.error("Error while updating user profile:", error);
      throw error;
    }
  }

  async updateUserPassword(data){
    try {
      const response = await fetchApi.patch(ApiUrl.user.userPasswordChange,data);
      return response.data;
    } catch (error) {
      console.error("Error while updating user password:", error);
      throw error;
    }
  }

  async getNotifications(data){
    try {
      const response = await fetchApi.post(ApiUrl.notification.getUserNotification,data);
      return response.data;
    } catch (error) {
      console.error("Error while getting notifications:", error);
      throw error;
    }
  }
}

export default new FetchData();
