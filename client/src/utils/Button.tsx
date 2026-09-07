import Link from 'next/link'
import React from 'react'

interface Type {
    path:string,
    label:string
}

const Button:React.FC<Type> = ({path="/" ,label,}) => {
  return (
    <Link href={path}
    className='text-white text-xl max-w-fit uppercase font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 ' >
      <button type="submit" className='cursor-pointer' >{label}</button>
    </Link>
  )
}

export default Button