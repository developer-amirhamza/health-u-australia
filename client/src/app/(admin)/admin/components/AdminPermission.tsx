"use client"
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "app/redux/store";
import IsAdmin from "utils/IsAdmin";

interface Props {
    children: React.ReactNode;
}

// Renders children only when the logged-in user has admin/owner permissions.
const AdminPermission: React.FC<Props> = ({ children }) => {
    const { user } = useSelector((state: RootState) => state.userSlice);

    if (!IsAdmin(user?.role)) return null;

    return <>{children}</>;
};

export default AdminPermission;
