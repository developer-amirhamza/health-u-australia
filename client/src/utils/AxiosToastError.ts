import toast from "react-hot-toast";
import { AxiosError } from "axios";

const AxiosToastError = (error: unknown) => {
    if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || error.message);
        return;
    }
    if (error instanceof Error) {
        toast.error(error.message);
        return;
    }
    toast.error("Something went wrong");
};

export default AxiosToastError;
