"use client";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { useDocuments } from "@/hooks/useDocuments";



interface SettingDialogProps {

    children: React.ReactNode;
}

export const SettingDialog = ({ children }: SettingDialogProps) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");

    // const { updateDocumentMutation } = useDocuments({});
    // const isUpdating = updateDocumentMutation.isPending;

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();

        // updateDocumentMutation.mutate(
        //     {
        //         documentId,
        //         updated: {
        //             title: title.trim(),
        //         },
        //     },
        //     {
        //         onSuccess: () => {
        //             setOpen(false);
        //         },
        //     }
        // );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Setting Organization</DialogTitle>
                </DialogHeader>
                <div className="my-4">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Document name"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        // disabled={isUpdating}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        // disabled={isUpdating || !title.trim()}
                        onClick={handleSave}
                    >
                        {/* {isUpdating ? "Saving..." : "Save"} */}Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};