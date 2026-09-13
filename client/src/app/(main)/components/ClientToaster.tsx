"use client"

import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

// react-hot-toast's positioning wrappers are computed by goober differently
// between the server render and the client's first paint, causing a
// hydration mismatch even with zero toasts visible. Rendering nothing until
// after mount makes the client's first render match the (empty) server
// render exactly, so the Toaster only appears once hydration is already done.
const ClientToaster = () => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if (!mounted) return null
    return <Toaster />
}

export default ClientToaster
