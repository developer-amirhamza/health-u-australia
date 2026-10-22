"use client"
import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { usePathname, useRouter } from 'next/navigation'
import AdminSidebar from './components/AdminSidebar'
import AdminHeader from './components/AdminHeader'
import IsAdmin from 'utils/IsAdmin'
import { canAccessPath } from 'utils/adminAccess'
import { AppDispatch, RootState } from 'app/redux/store'
import { fetchUser } from 'app/redux/slices/userSlices'

const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {

    const [showSidebar, setShowSidebar] = useState(true);
    const [verified, setVerified] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const pathname = usePathname();
    const { user, status } = useSelector((state: RootState) => state.userSlice);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            setVerified(false);
            router.replace("/signin");
            return;
        }
        if (status === "idle") {
            dispatch(fetchUser());
            return;
        }
        if (status === "failed") {
            setVerified(false);
            router.replace("/signin");
            return;
        }
        if (status === "succeeded") {
            if (IsAdmin(user?.role)) setVerified(true);
            else {
                setVerified(false);
                router.replace("/signin");
            }
        }
    }, [pathname, status, user, router, dispatch]);

    // While we don't yet know who the user is, don't flash the admin UI.
    if (!verified || status === "idle" || status === "loading") {
        return (
            <div className="flex w-full h-screen items-center justify-center bg-[#f5f0eb]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a1a18]"></div>
            </div>
        );
    }

    // Loaded but not an admin -> render nothing while the redirect happens.
    if (!IsAdmin(user?.role)) {
        return null;
    }

    return (
        <>
            <div className="flex w-full h-screen items-start bg-[#f5f0eb] overflow-x-hidden">
                <div
                    className={`${showSidebar ? "w-64" : "w-24"} shrink-0 h-screen overflow-y-auto no-scrollbar bg-[#1a1a18] z-50 flex transition-[width] duration-200`}
                >
                    <AdminSidebar activeSidebar={showSidebar} />
                </div>
                <div className="min-w-0 flex-1 h-screen flex flex-col">
                    <AdminHeader sidebar={() => setShowSidebar(!showSidebar)} />
                    <div className=" no-scrollbar overflow-y-auto">
                        {canAccessPath(user, pathname) ? children : (
                            // a moderator on a section an admin hasn't granted them
                            <div className="flex flex-col items-center justify-center text-center gap-2 px-6 py-24">
                                <h1 className="font-serif text-2xl text-[#1a1a18]">No access to this section</h1>
                                <p className="text-sm text-gray-600 max-w-md">
                                    This section holds official records. Ask an admin to grant you access from the All Users page.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminLayout
