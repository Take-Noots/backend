import { Chat, Message } from './models';
import { ChatType, CreateChatInput } from './types/chat';
import { MessageType, SendMessageInput } from './types/message';

// CHAT REPOSITORY FUNCTIONS

export const findChatsByUserId = async (userId: string) => {
    return await Chat.find({ 
        participants: userId 
    })
    .populate('participants', 'username email')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
};

export const findChatById = async (chatId: string) => {
    return await Chat.findById(chatId)
        .populate('participants', 'username email');
};

export const findChatBetweenUsers = async (user1Id: string, user2Id: string) => {
    return await Chat.findOne({
        participants: { $all: [user1Id, user2Id] },
        isGroupChat: false
    });
};

export const createChat = async (chatData: CreateChatInput) => {
    const newChat = new Chat(chatData);
    await newChat.save();
    
    // Convert to ChatType
    const chat: ChatType = {
        _id: newChat._id.toString(),
        participants: newChat.participants.map(p => p.toString()),
        chatName: newChat.chatName ?? undefined,
        isGroupChat: newChat.isGroupChat,
        lastMessage: newChat.lastMessage?.toString(),
        createdAt: newChat.createdAt,
        updatedAt: newChat.updatedAt,
    };
    
    return chat;
};

export const updateChatLastMessage = async (chatId: string, messageId: string) => {
    return await Chat.findByIdAndUpdate(
        chatId,
        { lastMessage: messageId },
        { new: true }
    );
};

// ===== MESSAGE REPOSITORY FUNCTIONS =====

export const findMessagesByChatId = async (chatId: string, page: number = 1, limit: number = 50) => {
    const skip = (page - 1) * limit;
    
    return await Message.find({ chatId })
        .populate('senderId', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

export const createMessage = async (messageData: SendMessageInput) => {
    const newMessage = new Message({
        chatId: messageData.chatId,
        senderId: messageData.senderId,
        text: messageData.text,
        messageType: messageData.messageType || 'text',
        isRead: false,
        readBy: []
    });
    
    await newMessage.save();
    
    // Convert to MessageType
    const message: MessageType = {
        _id: newMessage._id.toString(),
        chatId: newMessage.chatId.toString(),
        senderId: newMessage.senderId.toString(),
        text: newMessage.text,
        messageType: newMessage.messageType,
        isRead: newMessage.isRead,
        readBy: newMessage.readBy.map(id => id.toString()),
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
    };
    
    return message;
};

export const markMessageAsRead = async (messageId: string, userId: string) => {
    return await Message.findByIdAndUpdate(
        messageId,
        { 
            $addToSet: { readBy: userId },
            isRead: true
        },
        { new: true }
    );
};

export const markAllMessagesAsRead = async (chatId: string, userId: string) => {
    return await Message.updateMany(
        { 
            chatId: chatId,
            senderId: { $ne: userId } // Don't mark own messages as read
        },
        { 
            $addToSet: { readBy: userId },
            isRead: true
        }
    );
};

export const getUnreadMessageCount = async (chatId: string, userId: string) => {
    return await Message.countDocuments({
        chatId: chatId,
        senderId: { $ne: userId }, // Don't count own messages
        readBy: { $ne: userId } // Messages not read by this user
    });
};

export const findMessageById = async (messageId: string) => {
    return await Message.findById(messageId)
        .populate('senderId', 'username email');
};