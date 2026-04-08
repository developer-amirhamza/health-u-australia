import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link';
interface Props {
    path:string | undefined,
    label:string | undefined,
}

const Nav:React.FC<Props> = ({path="", label=""}) => {
    const parentVariant = {
    initial: {},
    hover:{},
  };


  const childVariant = {
    initial:{width:0},
    hover:{width:"100%", transition:{duration:0.3}}
  }
  return (
    <>
    {path ? <motion.div variants={parentVariant} initial="initial" whileHover="hover" style={{cursor:"pointer"}} className="grid gap-0.5">
                    <Link className='font-medium' href={path}>{label} </Link>
                    <motion.div variants={childVariant} style={{width:0}} className='bg-primary h-0.5 '/>
                  </motion.div>  : <motion.div variants={parentVariant} initial="initial" whileHover="hover" style={{cursor:"pointer"}} className="grid gap-0.5">
                    <span className='font-medium' >{label} </span>
                    <motion.div variants={childVariant} style={{width:0}} className='bg-primary h-0.5 '/>
                  </motion.div>  }
    </>
  )
}

export default Nav