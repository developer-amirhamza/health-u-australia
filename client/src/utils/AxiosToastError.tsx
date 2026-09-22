"use client"
import toast from "react-hot-toast"


const AxiosToastError = (error:any)=>{
    toast.error(
        error?.response?.data?.message || error?.message || "Something went wrong. Please try again."
    )
}

export default AxiosToastError;