 "use server";

import {nanoid} from 'nanoid'
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { getAccessType, parseStringify } from '../utils';
import { redirect } from 'next/navigation';

export const createDocument = async ({userId, email}:CreateDocumentParams)=>{
    const roomId = nanoid()

    try {
        const metadata = {
            creatorId:userId,
            email,
            title:"Untitled"
        }

        const usersAccesses: RoomAccesses = {
            [email]:['room:write']
        }

        const room = await liveblocks.createRoom(roomId,{
            metadata,
            usersAccesses,
            defaultAccesses:[]
        })

        revalidatePath("/")

        return parseStringify(room)
    } catch (error) {
        console.log(`Error happend while creating a document: ${error}`);
        
    }
}

export const getDocument = async ({userId, roomId}:{userId:string, roomId:string})=>{
    try {
        const room = await liveblocks.getRoom(roomId)
        

        const hasAccess = Object.keys(room.usersAccesses).includes(userId)

        if (!hasAccess){
            throw new Error("You dont have access to this room")
        }

        return parseStringify(room)
    } catch (error) {
        console.log(`Error occured while fetching the document : ${error}`);
    }
}

export const updateDocument = async (roomId:string,title:string)=>{
    try {
        const updatedRoom = await liveblocks.updateRoom(roomId,{metadata:{title}})
        revalidatePath(`/documents/${roomId}`)
        return parseStringify(updatedRoom)
    } catch (error) {
        console.log(error);
        
    }
}

export const getAllDocuments = async (email:string)=>{
    try {
        const rooms = await liveblocks.getRooms({userId:email})
        
        return parseStringify(rooms)
    } catch (error) {
        console.log(`Error occured while fetching the documents : ${error}`);
    }
}

export const updateDocAccess = async ({roomId,email,userType,updatedBy}:ShareDocumentParams)=>{
    try {
        const usersAccesses:RoomAccesses = {
            [email]:getAccessType(userType) as AccessType,
        }
        const room  = await liveblocks.updateRoom(roomId,{usersAccesses})

        if (room){
            const notificationId = nanoid();
            await liveblocks.triggerInboxNotification({
                userId:email,
                kind:'$documentAccess',
                subjectId:notificationId,
                activityData:{
                    userType,
                    title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
                    updatedBy:updatedBy.name,
                    avatar: updatedBy.avatar,
                    email: updatedBy.email
                },
                roomId
            })
        }
        revalidatePath(`/documents/${roomId}`)
        return parseStringify(room )
    } catch (error) {
        console.log(error);
        
    }
     
}

export const removeUser = async({roomId,email}:{roomId:string,email:string})=>{
        try {
            const room = await liveblocks.getRoom(roomId)
            if (room.metadata.email === email){
                throw Error("You are the owner of the room, you can't remove yourself")
            }
            const updatedRoom = await liveblocks.updateRoom(roomId,{
                usersAccesses:{
                    [email]:null
                }
            })

            revalidatePath(`/documents/${roomId}`);
            return parseStringify(updatedRoom)
        } catch (error) {
            console.log(error);
            
        }
}

export const deleteDocument = async (roomId: string) => {
    try {
      await liveblocks.deleteRoom(roomId);
      revalidatePath('/');
      redirect('/');  //note: dont put double quoutes for redirect path, it causes an error
    } catch (error) {
      console.log(`Error happened while deleting a room: ${error}`);
    }
  }