import CollaborativeRoom from '@/components/CollaborativeRoom'
import { getDocument } from '@/lib/actions/room.actions'
import { getClerkUsers } from '@/lib/actions/user.actions'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const Document = async ({params : {id}}:SearchParamProps) => {
  const user = await currentUser()

  if (!user) redirect("/")

  const room = await getDocument({userId: user.emailAddresses[0].emailAddress,roomId:id})

  if (!room) redirect("/")
  const userIds = Object.keys(room.usersAccesses);
  
   const users = await getClerkUsers({userIds})
   
   const userData = users.map((user:User)=>({
    ...user,
    userType:room.usersAccesses[user.email]?.includes('room:write') ? 'editor' : 'viewer'
   }))
  
   const currentUserType = room.usersAccesses[user.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor' : 'viewer'

  return (
    <main className='flex w-full flex-col items-center'>
      <CollaborativeRoom
      roomId={id}
      roomMetadata = {room.metadata}
      users = {userData}
      currentUserType = {currentUserType}
      />
    </main>
  )
}

export default Document