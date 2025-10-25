"use client";

import { toast } from "sonner";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { FullscreenLoader } from "@/components/fullscreen-loader";

import { getUser } from "./actions";

type User = { id: string; name: string; avatar: string };

export function Room({ children }: { children: ReactNode }) {
    const params = useParams();
    const documentId = params.documentId as string;

    const [users, setUser] = useState<User[]>([]);

    const fetchUser = useMemo(
        () => async () => {
            try {
                const list = await getUser(documentId);
                setUser(list);
                console.log("👥 Fetched users for collaboration:", list);
            } catch {
                toast.error("Failed to fetch user");
            }
        },
        [documentId],
    );

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <LiveblocksProvider
            throttle={16}
            authEndpoint="/api/liveblocks-auth"
            resolveUsers={({ userIds }) => {
                return userIds.map(
                    (userId) => users.find((user) => user.id === userId) ?? undefined
                );
            }}
            resolveMentionSuggestions={({ text }) => {
                let filteredUsers = users;

                if (text) {
                    filteredUsers = users.filter((user) =>
                        user.name.toLowerCase().includes(text.toLowerCase())
                    );
                }

                return filteredUsers.map((user) => user.id);
            }}
            resolveRoomsInfo={() => []}
        >
            <RoomProvider id={params.documentId as string}>
                <ClientSideSuspense fallback={<FullscreenLoader label="Room loading..." />}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}