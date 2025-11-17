"use client";

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useDocumentPermissions } from "@/hooks/useDocumentPermissions";
import { getDocuments } from "./action";

interface RoomProps {
    children: ReactNode;
    initialTitle?: string;
}

export function Room({ children, initialTitle = "Untitled Document" }: RoomProps) {
    const params = useParams();
    const { data: members = [], isLoading } = useDocumentPermissions(params.documentId as string);

    if (isLoading) {
        return <div>Loading permissions...</div>;
    }

    return (
        <LiveblocksProvider
            throttle={16}
            authEndpoint={async (room) => {
                const { accessToken } = useAuthStore.getState();

                const response = await fetch("/api/liveblocks-auth", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        room: params.documentId,
                        accessToken
                    }),
                });

                return await response.json();
            }}
            resolveUsers={async ({ userIds }) => {
                if (!members) return [];
                return userIds.map((userId) => {
                    const member = members.find((m) => String(m.userId) === userId);

                    if (member) {
                        const avatarUrl = member.avartarUrl ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.displayName)}`;
                        return {
                            name: member.displayName || "Anonymous",
                            avatar: avatarUrl,
                        };
                    }
                    return undefined;
                });
            }}
            resolveMentionSuggestions={({ text }) => {
                if (!members) return [];
                let filteredUsers = members;

                if (text) {
                    filteredUsers = members.filter((member) => {
                        const searchText = text.toLowerCase();
                        return (
                            member.displayName?.toLowerCase().includes(searchText) ||
                            member.userName?.toLowerCase().includes(searchText) ||
                            member.email?.toLowerCase().includes(searchText)
                        );
                    });
                }
                return filteredUsers.map((member) => String(member.userId));
            }}
            resolveRoomsInfo={async ({ roomIds }) => {
                const documents = await getDocuments();
                return documents.map((document) => ({
                    id: document.id,
                    name: document.title,
                }));
            }}
        >
            <RoomProvider
                id={params.documentId as string}
                initialStorage={{
                    leftMargin: 56,
                    rightMargin: 56,
                    title: initialTitle  // 👈 Khởi tạo title từ database
                }}
            >
                <ClientSideSuspense fallback={<div>Loading room...</div>}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}
