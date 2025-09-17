"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
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
import { PlusIcon, School, Tag, Trash2Icon } from "lucide-react";
import { insertTag } from "../../convex/documentTags";

import { usePaginatedQuery } from "convex/react";
import { el } from "date-fns/locale";

interface AddTagDialogProps {
    documentId: Id<"documents">;
    initialTitle: string;
    children: React.ReactNode;
}

export const AddTagDialog = ({ documentId, initialTitle, children }: AddTagDialogProps) => {
    const update = useMutation(api.documents.updateById);

    const [open, setOpen] = useState(false);
    const insertDocTag = useMutation(api.documentTags.insertTag);
    const updateDocTag = useMutation(api.documentTags.updateByDocumentId);
    const removeDocTag = useMutation(api.documentTags.removeByDocumentId);

    const getTags = useQuery(api.documentTags.getTagsByDocumentId, {
        documentId,
    });

    const handleTagInsertUpdate = (tagId: string) => {
        if (getTags) {
            updateTag(tagId);
        } else {
            insertedTag(tagId);
        }
    };


    const handleTagRemove = () => {
        removeDocTag({ documentID: documentId });
    };

    const insertedTag = async (tagId: string) => {
        try {
            const result = await insertDocTag({ documentID: documentId, tagID: tagId });
        } catch (err) {
            console.error("Error inserting tag:", err);
        }
    };

    const updateTag = async (tagId: string) => {
        try {
            await updateDocTag({ documentID: documentId, tagID: tagId });
        } catch (err) {
            console.error("Error updating document title:", err);
        }
    };


    const { results, status, loadMore } = usePaginatedQuery(
        api.tags.getAllTags,
        {},
        { initialNumItems: 100 } // số item load lần đầu
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="mb-4">
                    <DialogTitle>Add Tag document</DialogTitle>
                    <DialogDescription>
                        Selection the tags you want to add to this document
                    </DialogDescription>
                </DialogHeader>
                {results?.length === 0 ? (<><p>No tags found</p></>) : (
                    <div className="flex flex-wrap gap-2">
                        <Button
                            className="text-white m-0.5 transition-colors"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(false);
                                handleTagRemove();
                            }}
                            style={{
                                backgroundColor: "gray",
                                filter: "brightness(1)",
                            }}
                            onMouseEnter={e => e.currentTarget.style.filter = "brightness(0.75)"}
                            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
                        >
                            <Trash2Icon />
                            <span>None</span>
                        </Button>
                        {results.map((tag) => (
                            <Button
                                key={tag._id}
                                className="text-white m-0.5 transition-colors"
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpen(false);
                                    handleTagInsertUpdate(tag._id);
                                }}
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
                        <Button
                            className="text-white m-0.5 transition-colors"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation(); setOpen(false);
                            }}
                            style={{
                                backgroundColor: "black",
                                filter: "brightness(1)",
                            }}
                            onMouseEnter={e => e.currentTarget.style.filter = "brightness(0.75)"}
                            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
                        >
                            <PlusIcon />
                            <span>New ..</span>
                        </Button>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        type="button"
                        variant="ghost"

                        onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};