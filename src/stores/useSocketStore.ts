// src/stores/useSocketStore.ts

import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { Editor } from "@tiptap/react";

interface SocketState {
    socket: Socket | null;
    isConnected: boolean;
    currentDocId: string | null;

    // Actions
    initSocket: () => void;
    joinDocument: (docId: string, editor: Editor) => void;
    leaveDocument: () => void;
    sendUpdate: (docId: string, content: string) => void;
    disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,
    currentDocId: null,

    initSocket: () => {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://127.0.0.1:5000";
        const socket = io(socketUrl);

        socket.on("connect", () => {
            set({ isConnected: true });
        });

        socket.on("disconnect", () => {
            set({ isConnected: false });
        });

        set({ socket });
    },

    joinDocument: (docId, editor) => {
        const { socket } = get();
        if (!socket) return;

        // Join room
        socket.emit("joinDoc", docId);

        // Listen for initial content
        socket.on("loadDoc", (content) => {
            editor.commands.setContent(content);
        });

        // Listen for updates
        socket.on("receiveUpdate", (content) => {
            editor.commands.setContent(content);
        });

        set({ currentDocId: docId });
    },

    leaveDocument: () => {
        const { socket } = get();
        if (!socket) return;

        socket.off("loadDoc");
        socket.off("receiveUpdate");

        set({ currentDocId: null });
    },

    sendUpdate: (docId, content) => {
        const { socket } = get();
        if (!socket) return;

        socket.emit("editDoc", { docId, content });
    },

    disconnect: () => {
        const { socket } = get();
        socket?.disconnect();
        set({ socket: null, isConnected: false, currentDocId: null });
    }
}));