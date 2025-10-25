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
        <LiveblocksProvider publicApiKey={"pk_dev_LEff48X1nSK2Q1HZIEcDCupamXcDa-dyQBrVVdD4a5ZhLTeY7xg50IrKOuWJ_yr8"}>
            <RoomProvider id={params.documentId as string}>
                <ClientSideSuspense fallback={<div>Loading…</div>}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}