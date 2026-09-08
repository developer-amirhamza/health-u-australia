


export const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL



export const SummeryApi = {

    verifyEmail: {
        url: "/api/user/verify-email",
        method: "post",
    },
    forgotPassword: {
        url: "/api/user/forgot-password",
        method: "post",
    },
    resetPassword: {
        url: "/api/user/reset-password",
        method: "post",
    },
    changePassword: {
        url: "/api/user/change-password",
        method: "put",
    },
    signup: {
        url: "/api/user/signup",
        method: "post",
    },
    signin: {
        url: "/api/user/signin",
        method: "post"
    },
    refreshToken: {
        url: '/api/user/refresh-token',
        method: 'post'
    },
    getUserDetails: {
        url: "/api/user/get-user-details",
        method: "get",
    },
    signout: {
        url: "/api/user/signout",
        method: "get",
    },
    imageUpload: {
        url: "/api/image/upload",
        method: "post",
    },
    fileUpload: {
        url: "/api/image/upload-file",
        method: "post",
    },
    updateUserDetails: {
        url: "/api/user/update-user",
        method: "put",
    },
    getAllUser: {
        url: "/api/user/all-users",
        method: "get",
    },
    updateUserByAdmin: {
        url: "/api/user/update-user-by-admin",
        method: "put",
    },
    deleteUser: {
        url: "/api/user/delete-user",
        method: "delete",
    },

    // ── SC Billing Tracker (admin-only: support coordination plans + time log) ──
    getScPlans: { url: "/api/sc-billing/plans", method: "get" },
    createScPlan: { url: "/api/sc-billing/plans/create", method: "post" },
    updateScPlan: { url: "/api/sc-billing/plans/update", method: "put" },
    deleteScPlan: { url: "/api/sc-billing/plans/delete", method: "delete" },
    getScEntries: { url: "/api/sc-billing/entries", method: "get" },
    createScEntry: { url: "/api/sc-billing/entries/create", method: "post" },
    updateScEntry: { url: "/api/sc-billing/entries/update", method: "put" },
    deleteScEntry: { url: "/api/sc-billing/entries/delete", method: "delete" },

    // ── Service Agreement Tool (create: any signed-in staff member; the rest are admin-only) ──
    getServiceAgreements: { url: "/api/service-agreements", method: "get" },
    getServiceAgreementById: { url: "/api/service-agreements/single", method: "get" },
    createServiceAgreement: { url: "/api/service-agreements/create", method: "post" },
    updateServiceAgreement: { url: "/api/service-agreements/update", method: "put" },
    deleteServiceAgreement: { url: "/api/service-agreements/delete", method: "delete" },
};