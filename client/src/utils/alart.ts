
import Swal from "sweetalert2";



export const successAlert = (title:string)=>{
    Swal.fire({
        icon:"success",
        title:title,
        confirmButtonColor : "#00b050",
        confirmButtonText:"Okay!"
    })
}

export const errorAlert = (title:string)=>{
    Swal.fire({
        icon:"error",
        title:title,
        confirmButtonText:"Okay!"
    })
}