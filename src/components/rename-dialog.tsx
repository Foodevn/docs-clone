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

import { useUpdateDocument } from "@/hooks/useDocuments";
import { Document } from "@/types/document";


interface RenameDialogProps {
    documentId: Document["id"];
    initialTitle: string;
    children: React.ReactNode;
}

export const RenameDialog = ({ documentId, initialTitle, children }: RenameDialogProps) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(initialTitle);
    const { mutate: updateDocument, isPending } = useUpdateDocument();

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        updateDocument({ id: documentId, data: { title } }, {
            onSuccess: () => {
                setOpen(false);
            }
        })

    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename document</DialogTitle>
                    <DialogDescription>
                        Enter a new name for this document
                    </DialogDescription>
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
                        disabled={isPending || !title.trim()}
                        onClick={handleSave}
                    >
                        {isPending ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};