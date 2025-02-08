import axios from "axios"
import { loginFailure, loginRequest, loginSuccess, logoutSuccess, reload } from "../reducers/authSlice"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from '@backpackapp-io/react-native-toast';

export const instance = axios.create({
    // baseURL: "http://192.168.29.247:3000/api/v1"
    baseURL: "http://ec2-65-0-130-71.ap-south-1.compute.amazonaws.com:3000/api/v1"
})

export const setHeader = async () => {
    const a = await AsyncStorage.getItem('accessToken');
    if (a) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${a}`;
    } else {
        instance.defaults.headers.common['Authorization'] = null;
    }
}


export const userLogin = (email, password) => async (dispatch) => {
    try {
        dispatch(loginRequest())
        const { data: { data } } = await instance.post("/user/login", {
            email, password
        })
        await AsyncStorage.setItem('refreshToken', data.refreshToken.toString());
        await AsyncStorage.setItem('accessToken', data.accessToken.toString());
        // const a = await AsyncStorage.getItem('accessToken')
        // const r = await AsyncStorage.getItem('refreshToken')
        dispatch(loginSuccess(data.user))
        // toast.success("Welcome");

    } catch (error) {
        toast.error(error.response.data.message);
        dispatch(loginFailure(error.response.data.message))
    }
}

export const getCurrentUser = () => async (dispatch, getState) => {

    try {
        // dispatch(loginRequest())
        await setHeader()
        const { data: { data } } = await instance.get("/user/me")
        dispatch(loginSuccess(data))
    } catch (error) {
        console.log(error.response.data)
        if (error.response.data.message === "Token Expired") {
            const refreshToken = await AsyncStorage.getItem('refreshToken')
            try {
                instance.defaults.headers.common['Authorization'] = null;
                const response = await instance.post("/user/token", {
                    refreshToken
                })
                await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken.toString());
                await AsyncStorage.setItem('accessToken', response.data.data.accessToken.toString());

                const rel = !(getState().auth.reload)
                dispatch(reload(rel))
                console.log("token refresh")
            } catch (err) {
                dispatch(loginFailure(err.response.data.message))
            }

        }
        else dispatch(loginFailure(error.response.data.message))
    }
}

export const logoutUser = () => async (dispatch, getState) => {
    try {
        await setHeader()
        const { data } = await instance.get("/user/logout")
        dispatch(logoutSuccess())
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('accessToken');
        await setHeader()
        // toast.success("Logged out!")
    } catch (error) {
        console.log(error.response.data)
    }
}
