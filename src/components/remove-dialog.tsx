"use client";
import { useState } from "react";
// import { useMutation } from "convex/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// import { Id } from "../../convex/_generated/dataModel";
// import { api } from "../../convex/_generated/api";
import { documents } from "@/db/schema";
import { useRouter } from "next/navigation";

type Document = typeof documents.$inferSelect;

interface RemoveDialogProps {
  documentId: Document["id"];
  children: React.ReactNode;
}

export const RemoveDialog = ({ documentId, children }: RemoveDialogProps) => {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const fetchDocuments = async (id: Document["id"]) => {
    try {

      const url = `/api/db/document/${documentId}`;
      const docsRes = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!docsRes.ok) {
        console.error(`Failed to fetch documents/${documentId}`);
        return;
      }
      router.refresh();

    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            document.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isRemoving}
            onClick={(e) => {
              e.stopPropagation();
              setIsRemoving(true);
              fetchDocuments(documentId)
                .finally(() => setIsRemoving(false));
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};