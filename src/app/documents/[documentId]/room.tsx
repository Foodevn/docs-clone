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

export function Room({ children }: { children: ReactNode }) {
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
                        room,
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
            resolveRoomsInfo={() => []}
        >
            <RoomProvider id={params.documentId as string}>
                <ClientSideSuspense fallback={<div>Loading room...</div>}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}
