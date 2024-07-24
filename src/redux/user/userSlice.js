import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
   currentUser : null,
   error : null,
   loading : false
};

const userSlice = createSlice({
   name : "user",
   initialState,
   reducers : {
      signInStart : (state) => {
         state.loading = true;
      },
      signInSuccess : (state, action) => {
         state.loading = false;
         state.currentUser = action.payload;
         state.error = null;
      },
      SignInFailure : (state, action) => {
         state.loading = false;
         state.error = action.payload;
      },
    //   logout : (state) => {
    //      state.currentUSer = null;
    //   },
    UpdateUserStart :(state) => {
      state.loading = true;
   },
   UpdateUserSuccess : (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
   },
   UpdateUserFailure : (state, action) => {
      state.loading = false;
      state.error = action.payload;
   },
   deleteUserStart : (state) => {
      state.loading = true;
   },
   deleteUserSuccess : (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = null;
   },
   deleteUserFailure : (state, action) => {
      state.loading = false;
      state.error = action.payload;
   },
   signOutUserStart : (state) => {
      state.loading = true;
   },
   signOutUserSuccess : (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = null;
   },
   signOutUserFailure : (state, action) => {
      state.loading = false;
      state.error = action.payload;
   }

   }
}); 
export const {signInStart, signInSuccess, SignInFailure , UpdateUserStart , UpdateUserSuccess , UpdateUserFailure, deleteUserFailure,deleteUserStart,deleteUserSuccess
   ,signOutUserFailure,signOutUserStart,signOutUserSuccess
} = userSlice.actions;
export default userSlice.reducer;