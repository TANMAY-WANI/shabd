"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { createDocument } from '@/lib/actions/room.actions'
import { useRouter } from 'next/navigation'
import Loader from './Loader'

const AddDocument = ({userId,email}:AddDocumentBtnProps) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const addDocumentHandler = async ()=>{
    try {
      setLoading(true)
      const room = await createDocument({userId,email})
      setLoading(false)
      if (room){
        router.push(`/documents/${room.id}`)
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  if (loading){
    return <Loader className='opacity-50 items-center justify-center  w-full h-full'/>
  }
  return (
    <Button type='submit' onClick={addDocumentHandler} className='gradient-blue flex gap-1 shadow-md'>
      <Image src="/assets/icons/add.svg" alt='add' width={24} height={24}/>
       <p className='hidden sm:block'>Start a blank document</p>
    </Button>
  )
}

export default AddDocument