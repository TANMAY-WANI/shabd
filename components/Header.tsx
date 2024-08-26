import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'

const Header = ({children}:HeaderProps ) => {
  return (
    <div className='header'>
        <Link href="/" className='md:flex-1 flex items-center'>
            <Image 
             src= "/assets/icons/logo-icon.svg"
            alt='Logo'
            height={100}
            width={32}
            className='mr-2'
             />
             <h2 className='text-white font-bold text-xl hidden md:block '>
                Shabd
             </h2>
        </Link>
        {children}
    </div>
  )
}

export default Header