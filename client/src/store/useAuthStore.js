import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/"

export const useAuthStore = create((set, get) => ({

  authUser: null,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async (getToken) => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });

      get().connectSocket(res.data);
    } catch (error) {
      const { socket } = get();
      set({ authUser: null, onlineUsers: [], socket: null });
      socket?.disconnect();
      if (error.response?.status !== 401 && error.response?.status !== 404) {
        console.error("Error in checkAuth:", error);
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  clearAuth: () => {
    const { authUser, isCheckingAuth, onlineUsers, socket } = get();
    if (authUser !== null || isCheckingAuth || onlineUsers.length > 0 || socket) {
      set({ authUser: null, isCheckingAuth: false, onlineUsers: [] });
    }
    socket?.disconnect();
    if (socket) set({ socket: null });
  },

  connectSocket: (user) => {
    const currentSocket = get().socket;
    if (!user) return;
    if (currentSocket?.io.opts.query?.userId === user._id) return;
    currentSocket?.disconnect();

    const socket = io(BASE_URL, { query: { userId: user._id } });

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
    set({ socket: null });
  },
}))
