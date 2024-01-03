import axios from 'axios';

const BASE=process.env.REACT_APP_API_URL;

const api=axios.create({
    baseURL:BASE,
    credentials:'include',
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});


export const sendOtp=(data)=>api.post('/api/otp',data);
export const verifyOtp=(data)=>api.post('/api/verify-otp',data);
export const activate=(data)=>api.post('/api/activate',data);
export const logout=()=>api.post('/api/logout');
export const createRoom=(data)=>api.post('/api/rooms',data);
export const getAllRooms=()=>api.get('/api/rooms');


//Interceptors-----------------
api.interceptors.response.use((config)=>{
    return config;
},async(err)=>{
    const originalRequest=err.config;
    if(err.reponse.status==400 && originalRequest&&!originalRequest._isRetry){
        originalRequest.isRetry=true;
        try{

        await axios.get(`${process.env.REACT_APP_API_URL}/api/refresh`,{
            withCredentials:true
        });

        return api.request(originalRequest);

        }catch(err){
            console.log(err);
        }
    }
    throw err;
});


export default api;