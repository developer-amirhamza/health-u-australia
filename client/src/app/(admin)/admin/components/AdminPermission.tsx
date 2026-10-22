import { RootState } from 'app/redux/store';
import React from 'react'

import { useSelector } from 'react-redux'
import { canAccessSection, isFullAdmin, type AdminSection } from 'utils/adminAccess';


interface type {
    children:any
    // a restricted section: shown to admins, and to moderators granted it.
    // Without one, only admins (ADMIN / OWNER) see the children.
    section?: AdminSection
}


const AdminPermission:React.FC<type> = ({children, section}) => {
const {user} = useSelector((state:RootState)=>state.userSlice);
  const allowed = section ? canAccessSection(user, section) : isFullAdmin(user?.role)
  return (
    <>
    {allowed && children }
    </>
  )
}

export default AdminPermission