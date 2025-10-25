"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Plus, Settings } from "lucide-react";
import { useOrganizations } from "@/hooks/use-organization";
import { CreateDialog } from "@/components/create-dialog";
import { SettingDialog } from "@/components/setting-dialog";


export type OrgRole = "Owner" | "Admin" | "Member" | string;

// 🔹 Hàm lưu current organization vào localStorage
const saveCurrentOrgToLocalStorage = (orgId: string) => {
    try {
        localStorage.setItem("currentOrgId", orgId);
    } catch (error) {
        console.error("Failed to save organization to localStorage:", error);
    }
};

// 🔹 Hàm lấy current organization từ localStorage
const getCurrentOrgFromLocalStorage = (): string | null => {
    try {
        return localStorage.getItem("currentOrgId");
    } catch (error) {
        console.error("Failed to get organization from localStorage:", error);
        return null;
    }
};

export interface OrganizationSwitcherProps {
    currentOrgId?: string;
    className?: string;
    onCreate?: () => void; // optional – called when user clicks "Create organization"
    onManage?: (orgId: string) => void; // optional – called when user clicks Manage gear
}

export default function OrganizationSwitcher({
    currentOrgId,
    className,
    onCreate,
    onManage,
}: OrganizationSwitcherProps) {

    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { organizations, current, setCurrent } = useOrganizations();

    // 🔹 Khởi tạo current từ localStorage khi component mount
    useEffect(() => {
        const savedOrgId = getCurrentOrgFromLocalStorage();
        if (savedOrgId && organizations.length > 0) {
            const savedOrg = organizations.find((o) => o.id === savedOrgId);
            if (savedOrg) {
                setCurrent(savedOrg);
            }
        }
    }, [organizations, setCurrent]);

    // Close on outside click
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!open) return;
            const target = e.target as Node;
            if (!menuRef.current || !buttonRef.current) return;
            if (
                !menuRef.current.contains(target) &&
                !buttonRef.current.contains(target)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    function Avatar({ name }: { name: string }) {

        const initials = name
            .split(" ")
            .map((s) => s[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
        return (
            <div className="h-6 w-6 rounded-md bg-indigo-100 text-indigo-700 grid place-items-center text-[10px] font-semibold">
                {initials}
            </div>
        );
    }

    const defaultButtonLabel = () => {
        if (organizations.length == 0)
            return;
        if (!current)
            saveCurrentOrgToLocalStorage(organizations[0].id);
        return (
            <div className="flex items-center gap-2">
                <Avatar name={current?.name || organizations[0].name} />
                <span className="truncate max-w-[140px] text-sm font-medium">{current?.name || organizations[0].name}</span>
            </div>
        );
    }

    return (
        <div className={"relative inline-block text-left " + (className ?? "")}>
            {/* Toggle button */}
            <button
                ref={buttonRef}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                {defaultButtonLabel()}
                <ChevronDown className="h-4 w-4 opacity-70" />
            </button>

            {/* Menu */}
            {open && (
                <div
                    role="menu"
                    aria-labelledby="org-switcher"
                    className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5"
                >
                    <div className="max-h-[60vh] overflow-y-auto py-2">
                        {organizations.map((org) => (
                            <div
                                key={org.id}
                                role="menuitem"
                                tabIndex={-1}
                                onClick={() => {
                                    // onSelect(org.id);
                                    setCurrent(org);
                                    saveCurrentOrgToLocalStorage(org.id);
                                }}
                                className={
                                    "group flex items-center gap-3 px-3 py-2 cursor-pointer outline-none hover:bg-gray-50"
                                }
                            >
                                <Avatar name={org.name} />
                                <div className="flex min-w-0 flex-1 items-center justify-between">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-900">
                                            {org.name}
                                        </p>
                                        {org.role && (
                                            <p className="truncate text-xs text-gray-500">{org.role}</p>
                                        )}
                                    </div>

                                    {/* Manage gear */}
                                    <SettingDialog
                                        organizationId={org.id}
                                        name={org.name}
                                        description={org.description}
                                        role={org.role}

                                    >
                                        <button
                                            title="Manage"
                                            className="invisible group-hover:visible rounded-md p-1 hover:bg-gray-100 focus:visible"
                                        >
                                            <Settings className="h-4 w-4 text-gray-500" />
                                        </button>
                                    </SettingDialog>

                                </div>
                            </div>
                        ))}

                        {/* Divider */}
                        <div className="my-1 border-t border-gray-100" />

                        {/* Create organization */}
                        <CreateDialog>
                            <button
                                role="menuitem"
                                tabIndex={-1}

                                className={
                                    "flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-50"
                                }
                            >

                                <div className="h-6 w-6 rounded-md border border-dashed grid place-items-center">
                                    <Plus className="h-4 w-4" />
                                </div>
                                <span>Create organization</span>


                            </button>
                        </CreateDialog>
                    </div>


                </div>
            )
            }
        </div >
    );
}
