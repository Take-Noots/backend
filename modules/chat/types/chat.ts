export type ChatType = {
  _id: string;
  participants: string[]; // Array of user IDs
  chatName?: string; // Optional for group chats
  isGroupChat: boolean;
  lastMessage?: string; // ID of the last message
  createdAt: Date;
  updatedAt: Date;
};

export type CreateChatInput = {
  participants: string[];
  chatName?: string;
  isGroupChat: boolean;
};