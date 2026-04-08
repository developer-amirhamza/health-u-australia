import React from 'react'
import { motion } from 'framer-motion'
interface Type {
    title1?:string,
    title2?:string,
    className?:any,
}
const Title:React.FC<Type> = ({title1="",title2="",className=""}) => {
  const parentVariant = {
    initial: {},
    hover:{},
  }
  const childVariant = {
    initial:{width:"56px"},
    hover:{width:"100%", transition:{duration:0.5}}
  };
  return (
    <motion.div variants={parentVariant} initial="initial" whileHover="hover" className={`grid gap-2 py-3  w-full ${className}`}>
        <h1 className="text-[32px] font-bold ">{title1} <span className="text-secondary">{title2}</span></h1>
        <motion.div variants={childVariant} style={{width:"56px"}}  className=' h-0.75 bg-primary items-center flex  ' />
    </motion.div>
  )
}

export default Title