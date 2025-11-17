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
    documentId: number,
    children: React.ReactNode;
}

interface PermissionData {
    documentId: number;
    permission: {
        role: string;
        canEdit: boolean;
    };

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
    const [isChecking, setIsChecking] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [permissionData, setPermissionData] = useState<PermissionData["permission"]>({ role: '', canEdit: false });

    const attachPermissions = (permission: string): PermissionData["permission"] => {
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
                return { role: 'nodoor', canEdit: false };
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
                console.error(error);
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
    // ⭐ Truyền cả documentId vào Context
    const contextValue = {
        documentId,  // ⭐ Thêm vào đây
        permission: permissionData,
    };

    return (
        <PermissionContext.Provider value={contextValue}>
            {children}
        </PermissionContext.Provider>
    );
}
export default Permission;

