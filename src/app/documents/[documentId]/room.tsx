"use client";

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";

export function Room({ children }: { children: ReactNode }) {
    const params = useParams();

    return (
        <LiveblocksProvider publicApiKey={"pk_dev_-qExoS1HSy5pCPGX8k4SnLWDpDFyHuswcs2Wpn8NNBumE5NQy5_h8uiVwVQrt5ap"}>
            <RoomProvider id={params.documentId as string}>
                <ClientSideSuspense fallback={<div>Loading…</div>}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}