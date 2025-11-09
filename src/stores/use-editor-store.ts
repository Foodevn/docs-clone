import { create } from "zustand";
import { type Editor } from "@tiptap/react";
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:5000");

interface EditorState {
    editor: Editor | null;
    setEditor: (editor: Editor | null) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
    editor: null,
    setEditor: (editor) => {
        set({ editor });
    },
}));