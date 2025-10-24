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
import { useOrganizations } from "@/hooks/use-organization";



interface SettingDialogProps {
    organizationId: string,
    name: string,
    description: string,
    role: string,
    children: React.ReactNode
}

export const SettingDialog = ({
    children,
    organizationId,
    name,
    description,
    role
}: SettingDialogProps) => {
    const [open, setOpen] = useState(false);
    // const [title, setTitle] = useState("");
    const [nameUpdate, setNameUpdate] = useState(name);
    const [descriptionUpdate, setdescriptionUpdate] = useState(description);

    // const { updateDocumentMutation } = useDocuments({});
    const { updateOrganizationMutation } = useOrganizations();
    const isUpdating = updateOrganizationMutation.isPending;

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();

        updateOrganizationMutation.mutate(
            {
                organizationId,
                name: nameUpdate,
                description: descriptionUpdate,
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
                    <DialogTitle>Setting Organization</DialogTitle>
                </DialogHeader>
                <div className="my-4 ">
                    <Input
                        value={nameUpdate}
                        onChange={(e) => setNameUpdate(e.target.value)}
                        placeholder="Organization name"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <Input
                        value={descriptionUpdate}
                        onChange={(e) => setdescriptionUpdate(e.target.value)}
                        placeholder="Organization description"
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
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(false);
                        }}
                    >
                        Leave
                    </Button>
                    {role.trim().toLowerCase() === "admin" && (<Button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(false);
                        }}
                    >
                        Remove
                    </Button>)}

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