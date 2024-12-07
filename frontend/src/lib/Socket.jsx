import { createContext, useContext, useMemo } from "react";
import { io} from "socket.io-client";
import { server} from "../utils/config";

export const SocketContext = createContext();

export const getSocket = ()=>{ return useContext(SocketContext).socket};
 
export const SocketProvider = ( { children})=>{

    const socket = useMemo(()=>io(server) ,[]);

    return <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
}



















