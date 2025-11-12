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