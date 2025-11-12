import { z } from 'zod'

// För frontend
export type UserListItem = {
  userId: string;
  username: string;
};

export type ChannelItem = {
    Pk: string,
    Sk: "INFO";
    name?: string;
    isLocked?: boolean;
}

export interface Channels {
  Pk: string;
  Sk: string;
  name?: string;
  isLocked?: boolean;
}

export interface Message {
  Sk: string;
  time: string;
  text: string;
  senderName?: string;
  senderId?: string;
}

export type ChannelMessage = {
    Pk: string,
    Sk: string,
    text: string,
    time: string,
    senderId?: string;
    senderName?: string;
    type: "channelMessage";
}

export type DmMessage = {
    Pk: string,
    Sk: string,
    text: string,
    time: string,
    senderId?: string;
    receiverId: string; 
    senderName?: string;
    type: "dmMessage";
}

export type LoginResponse = {
  success: boolean;
  message?: string;
  userId: string;
  username?: string;
  token: string;
};

export type RegisterResponse = {
  success: boolean;
  message?: string;
  userId: string;
  token: string;
};

export const UserListItemSchema = z.object({
  userId: z.string(),
  username: z.string(),
});
export const UserListSchema = z.array(UserListItemSchema); 

export const DmMessageSchema = z.object({
  Pk: z.string(),
  Sk: z.string(),
  text: z.string(),
  time: z.string(),            
  senderId: z.string().optional(),
  receiverId: z.string(),
  senderName: z.string().optional(),
  type: z.literal("dmMessage"),
});
export const DmMessageListSchema = z.array(DmMessageSchema);