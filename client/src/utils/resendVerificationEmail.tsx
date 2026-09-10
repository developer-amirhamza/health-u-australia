"use client"

import { SummeryApi } from "app/common/SummeryApi";
import Axios from "./Axios";

// Works both signed in (identified via the access token, e.g. the header
// alert) and signed out (identified by the email just typed on the blocked
// sign-in screen) — pass email only when there's no session yet.
const resendVerificationEmail = async (email?: string) => {
    const response = await Axios({
        ...SummeryApi.resendVerificationEmail,
        data: email ? { email } : {},
    });
    return response?.data;
};

export default resendVerificationEmail;