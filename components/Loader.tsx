import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

const Loader = ({className}:{className?:string}) => {
  return (
    <div className={cn('loader', className)}>
        <Image src="/assets/icons/loader.svg" alt="Loader" height={32} width={32} className='animate-spin'/>
        Loading...
    </div>
  )
}

export default Loader