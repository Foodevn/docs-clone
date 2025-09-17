"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
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
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { School, Tag } from "lucide-react";

import { usePaginatedQuery } from "convex/react";

interface AddTagDialogProps {
    documentId: Id<"documents">;
    initialTitle: string;
    children: React.ReactNode;
}

export const AddTagDialog = ({ documentId, initialTitle, children }: AddTagDialogProps) => {
    const update = useMutation(api.documents.updateById);
    const [isUpdating, setIsUpdating] = useState(false);
    const [title, setTitle] = useState(initialTitle);
    const [open, setOpen] = useState(false);

    const { results, status, loadMore } = usePaginatedQuery(
        api.tags.getAllTags,
        {},                 // không có filter gì
        { initialNumItems: 5 } // số item load lần đầu
    );
    console.log(results);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);
        update({ id: documentId, title: title.trim() || "Untitled" })
            .catch(() => toast.error("Something went wrong"))
            .then(() => toast.success("Document updated"))
            .finally(() => {
                setIsUpdating(false);
                setOpen(false);
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={onSubmit}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>Add Tag document</DialogTitle>
                        <DialogDescription>
                            Selection the tags you want to add to this document
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex">
                        {results?.map((tag) => (
                            <Button
                                className="text-white m-0.5 transition-colors"
                                type="button"
                                disabled={isUpdating}
                                onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                                style={{
                                    backgroundColor: tag.color ?? "#e0e7ff",
                                    filter: "brightness(1)",
                                }}
                                onMouseEnter={e => e.currentTarget.style.filter = "brightness(0.75)"}
                                onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
                            >
                                <Tag />
                                <span>{tag.name}</span>
                            </Button>

                        ))}

                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={isUpdating}
                            onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                        >
                            Cancel
                        </Button>
                        <Button

                            type="submit"
                            disabled={isUpdating}
                            onClick={(e) => e.stopPropagation()}
                        >
                            New
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};