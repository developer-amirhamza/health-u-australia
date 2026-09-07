


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
};