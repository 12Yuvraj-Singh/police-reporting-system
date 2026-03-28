import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { initSocket } from "../socket/socketClient";

export const SocketContext = createContext(null);

export default function SocketProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;
    const s = initSocket(token);
    setSocket(s);
    return () => {
      if (s) s.disconnect();
    };
  }, [token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
