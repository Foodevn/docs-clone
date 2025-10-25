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
import { documents } from "@/db/schema";
import { useOrganizations } from "@/hooks/use-organization";

type Document = typeof documents.$inferSelect;

interface CreateDialogProps {

    children: React.ReactNode;
}

export const CreateDialog = ({ children }: CreateDialogProps) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const { addOrganizationMutation } = useOrganizations();

    const isUpdating = addOrganizationMutation.isPending;

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();

        addOrganizationMutation.mutate(
            {
                name,
                description,
            },
            {
                onSuccess: () => {
                    setOpen(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Organization</DialogTitle>
                    <DialogDescription>
                        Enter a new name for this organization
                    </DialogDescription>
                </DialogHeader>
                <div className="my-4 space-y-3">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Organization name"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Organization description"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        disabled={isUpdating}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isUpdating || !name.trim()}
                        onClick={handleSave}
                    >
                        {isUpdating ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};