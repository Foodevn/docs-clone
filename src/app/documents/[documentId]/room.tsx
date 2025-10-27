"use client";

import { toast } from "sonner";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from '@/constants/margins';
import { FullscreenLoader } from "@/components/fullscreen-loader";

import { getUser, getDocuments } from "./actions";

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
            authEndpoint={async () => {
                const endpoint = "/api/liveblocks-auth";
                const room = params.documentId as string;

                const response = await fetch(endpoint, {
                    method: "POST",
                    body: JSON.stringify({ room }),
                });

                return await response.json();
            }}

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
            resolveRoomsInfo={async ({ roomIds }) => {
                const documents = await getDocuments(roomIds as string[]);
                return documents.map((document) => ({
                    id: document.id,
                    name: document.title,
                }));
            }}
        >
            <RoomProvider
                id={params.documentId as string}
                initialStorage={{ leftMargin: LEFT_MARGIN_DEFAULT, rightMargin: RIGHT_MARGIN_DEFAULT }}
            >
                <ClientSideSuspense fallback={<FullscreenLoader label="Room loading..." />}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}