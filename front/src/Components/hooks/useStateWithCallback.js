import { useCallback, useEffect, useRef, useState } from "react";

export const useStateWithCallback=(initialState)=>{

    const cbref=useRef(); 
    const [state,setstate]=useState(initialState);

    //after every render no new function created
    const updatestate=useCallback((newState,cb)=>{
        cbref.current=cb;
        setstate((prev)=>{
            return typeof newState==='function'?
            newState(prev):newState
        })

    },[]);

    useEffect(()=>{
        if(cbref.current){
            cbref.current(state);
            cbref.current=null;
        }
        
    },[state]);


    return [state,updatestate];

 
}
