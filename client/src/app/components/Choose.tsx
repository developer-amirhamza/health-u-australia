"use client"
import Image from 'next/image'
import bg_pattern from "assets/images/choose-pattan-img.png"
import { motion } from 'framer-motion'
import { choose_items } from 'config/page'
import { fadeIn } from 'app/variants'
const Choose = () => {
  return (
    <section className='w-full h-full bg-white  flex justify-center items-center '
    style={{ backgroundImage:`url(${bg_pattern.src})`, backgroundSize:"95%", backgroundRepeat:"no-repeat" , backgroundPosition:"center" }}
    >
      <div className="container mx-auto w-full h-full  items-center justify-center py-12 flex flex-col  ">
        <motion.div className="grid gap-8 py-5   "
        variants={fadeIn("up",0.2)}
            initial={{
              opacity:0,
              x:0,
              y:-40,
            }}
            whileInView={{
              opacity:1,
              x:0,
              y:0,
              transition:{
                type:"tween",
                delay:0.3,
                duration:1,
                ease:[0.25,0.25,0.25,0.76]
              }
            }}
            viewport={{once:false, amount:1}}>
          <h1 className=" text-3xl w-full text-center  text-primary font-bold ">Health U Australia</h1>
        <h1 className="text-4xl w-full  text-center text-black font-bold uppercase ">Why Choose Us</h1>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
          {choose_items.map((item,index)=>(
            <motion.div key={index} custom={index}
            variants={fadeIn("down",0.2 * index)}
            initial={{
              opacity:0,
              y:-40,
              x:0,
            }}
            whileInView={{
              opacity:1,
              y:0,
              x:0,
              transition:{
                type:"spring",
                delay:index * 0.3,
                duration:1,
                ease:[0.25,0.25,0.25,0.75]
              }
            }}
            viewport={{once:false, amount:1}}
            className="w-full h-full min-h-80 relative flex">
            <div className={`bg-secondary absolute min-h-80 w-full p-3 py-10 h-full ${[0,2,4].includes(index) ? "rounded-tr-[4rem]" : "rounded-tl-[4rem]" }  grid gap-5`} >
              <Image src={item.logo} alt='' className={`absolute top-0 ${[0,2,4].includes(index) ? "left-0" : "right-0" }`} />
              <Image src={item.icon} alt='' className={`absolute top-3 object-scale-down ${[0,2,4].includes(index) ? "right-3" : "left-3" }`} />
              <div className="absolute lg:top-1/2 md:top-1/3 top-1/2  md:py-5 lg:py-0 px-5   mb-10 grid gap-3">
                <h1 className="lg:text-[1.3rem] md:text-[1.3rem] sm:text-2xl font-bold  text-3xl ">{item.title} </h1>
                <p className="text-lg font-medium lg:text-base  ">{item.paragraph} </p>
              </div>
            </div>
          </motion.div>
          ))}


        </div>
      </div>
    </section>
  )
}

export default Choose