import { useEffect, useRef, useState } from "react";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { useStatus } from "@liveblocks/react";
import { LoaderIcon } from "lucide-react";

import { Document } from "@/types/document";
import { useDebounce } from "@/hooks/use-debounce";
import { usePermission } from "@/components/auth/permission";
import { useLiveblocksTitle } from "@/hooks/use-liveblocks-title";

interface DocumentInputProps {
  id: Document["id"];
};

export const DocumentInput = ({ id }: DocumentInputProps) => {
  const status = useStatus();

  const { title, updateTitle } = useLiveblocksTitle(id);

  const [value, setValue] = useState(title || "Untitled");
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const permission = usePermission().permission;

  useEffect(() => {
    if (title) {
      setValue(title);
    }
  }, [title]);

  const debounceUpdate = useDebounce((newTitle: string) => {
    if (newTitle === title) return;

    setIsPending(true);
    updateTitle(newTitle);
    setIsPending(false);
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debounceUpdate(newValue);
  };

  const handleSummit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    updateTitle(value);
    setIsPending(false);
  };

  const showLoader = isPending || status === "connecting" || status === "reconnecting";
  const showError = status === "disconnected";

  return (
    <div className="flex items-center gap-2">
      {(isEditing && (permission.role == "admin")) ? (
        <form onSubmit={handleSummit} className="relative w-fit max-w-[50ch]">
          <span className="invisible whitespace-pre px-1.5 text-lg">
            {value || " "}
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            onBlur={() => setIsEditing(false)}
            className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate"
          />
        </form>
      ) : (
        <span
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
          className="text-lg px-1.5 cursor-pointer truncate">
          {title}
        </span>
      )}
      {showError && <BsCloudSlash className="size-4" />}
      {!showError && !showLoader && <BsCloudCheck />}
      {showLoader && <LoaderIcon className="size-4 animate-spin text-muted-foreground" />}
    </div>
  );
};
