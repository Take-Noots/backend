export type MessageType = {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  messageType: 'text' | 'image' | 'audio'; // Can extend later
  isRead: boolean;
  readBy: string[]; // Array of user IDs who read the message
  createdAt: Date;
  updatedAt: Date;
};

export type SendMessageInput = {
  chatId: string;
  senderId: string;
  text: string;
  messageType?: 'text' | 'image' | 'audio';
};

export type MessageWithSender = {
  _id: string;
  chatId: string;
  senderId: string;
  senderName: string; // Username of sender
  text: string;
  messageType: 'text' | 'image' | 'audio';
  isRead: boolean;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
};