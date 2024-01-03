import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch,useSelector } from "react-redux";
import { setAuth } from "../../store/authSlice";

export function useLoadingWithRefresh(){
    const [loading,setloading]=useState(true);


    // const api=axios.create();

    const dispatch=useDispatch();
    useEffect(()=>{

       const refreshfunc=async()=>{
         try{
        const {data}= await axios.get('http://localhost:5000/api/refresh',{withCredentials:true});
        dispatch(setAuth(data));
        setloading(false);
         }catch(err){
            console.error(err);
            setloading(false);
         }
        }
        refreshfunc();
    },[]);
    

    return {loading};

}