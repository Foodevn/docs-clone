"use client";

import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import React, {
    useEffect,
    useState,
    createContext,
    useContext
} from "react";

interface PermissionPops {
    documentId: string,
    children: React.ReactNode;
}

interface PermissionData {
    role: string;
    canView?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canShare?: boolean;
}

const PermissionContext = createContext<PermissionData | null>(null);

export const usePermission = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error('usePermission phải dùng trong Permission component');
    }
    return context;
};

const Permission = ({ documentId, children }: PermissionPops) => {
    const router = useRouter(); // ⭐ useRouter thay vì redirect
    const [isChecking, setIsChecking] = useState(true); // ⭐ Loading state
    const [hasAccess, setHasAccess] = useState(false); // ⭐ Access state
    const [permissionData, setPermissionData] = useState<PermissionData | null>(null);

    const attachPermissions = (permission: string): PermissionData => {
        switch (permission) {
            case 'admin':
                return {
                    role: 'admin',
                    canEdit: true,
                }

            case 'member':
                return {
                    role: 'member',
                    canEdit: true,

                }
            case 'viewer':
                return {
                    role: 'viewer',
                    canEdit: false,
                }
            default:
                return { role: 'nodoor' };
        }

    }
    useEffect(() => {
        const init = async () => {
            try {
                const res = await api.post(`/documentpermissions/check`, { documentId });
                if (!res.data.permission) {
                    return router.push("/");
                }
                setPermissionData(attachPermissions(res.data.permission))
                setHasAccess(true);
            } catch (error) {
                return router.push("/");
            } finally {
                setIsChecking(false);
            }
        }
        init();
    }, [documentId]);

    if (isChecking) {
        return <div className="flex items-center justify-center h-screen">
            Đang kiểm tra quyền...
        </div>;
    }

    if (!hasAccess) {
        router.push("/");
        return <div className="flex items-center justify-center h-screen">
            Bạn không có quyền truy cập
        </div>;
    }
    return (
        <PermissionContext.Provider value={permissionData}>
            {children}
        </PermissionContext.Provider>
    );
}
export default Permission;

