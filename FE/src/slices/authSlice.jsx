import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState:{
        user:null,
        isAuthenticated: false,
        loading: false,
    },
    reducers: {
        userdata(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },
        login(state, action) {
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logout(state) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            state.user = null;
            state.isAuthenticated = false;
        },
        updateUser(state, action) {
            localStorage.setItem('user', JSON.stringify(action.payload));
            state.user = action.payload;
        }
        
    }
});
export const { login, userdata } = authSlice.actions;

export default authSlice.reducer;