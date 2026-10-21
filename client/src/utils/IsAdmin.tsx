// Who may enter the admin panel. OWNER is the site owner and has full admin
// access everywhere ADMIN does. MODERATOR enters too, but the official-data
// sections check utils/adminAccess before showing anything.
const IsAdmin = (role: any) => {
    if (typeof role !== "string") return false;
    const r = role.toUpperCase();
    return r === "ADMIN" || r === "OWNER" || r === "MODERATOR";
};

export default IsAdmin;