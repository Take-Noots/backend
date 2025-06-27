import * as chatRepository from './repository';
import { CreateChatInput } from './types/chat';
import { SendMessageInput, MessageWithSender } from './types/message';

// ===== CHAT SERVICE FUNCTIONS =====

export const getUserConversations = async (userId: string) => {
    try {
        const chats = await chatRepository.findChatsByUserId(userId);
        
        // Transform data for frontend
        const conversations = await Promise.all(chats.map(async (chat: any) => {
            // Get unread message count
            const unreadCount = await chatRepository.getUnreadMessageCount(chat._id.toString(), userId);
            
            // Get other participant (for one-on-one chats)
            const otherParticipant = chat.participants.find((p: any) => p._id.toString() !== userId);
            
            return {
                _id: chat._id.toString(),
                participants: chat.participants,
                chatName: chat.chatName || otherParticipant?.username || 'Unknown User',
                isGroupChat: chat.isGroupChat,
                lastMessage: chat.lastMessage,
                unreadCount: unreadCount,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt,
                otherUser: otherParticipant ? {
                    _id: otherParticipant._id.toString(),
                    username: otherParticipant.username,
                    email: otherParticipant.email
                } : null
            };
        }));
        
        return conversations;
    } catch (error) {
        throw new Error('Failed to get user conversations: ' + (error instanceof Error ? error.message : String(error)));
    }
};

export const createOrGetChat = async (user1Id: string, user2Id: string) => {
    try {
        // Check if chat already exists between these users
        const existingChat = await chatRepository.findChatBetweenUsers(user1Id, user2Id);
        
        if (existingChat) {
            return {
                _id: existingChat._id.toString(),
                participants: existingChat.participants.map(p => p.toString()),
                chatName: existingChat.chatName,
                isGroupChat: existingChat.isGroupChat,
                lastMessage: existingChat.lastMessage?.toString(),
                createdAt: existingChat.createdAt,
                updatedAt: existingChat.updatedAt,
            };
        }
        
        // Create new chat
        const chatData: CreateChatInput = {
            participants: [user1Id, user2Id],
            isGroupChat: false
        };
        
        const newChat = await chatRepository.createChat(chatData);
        return newChat;
    } catch (error) {
        throw new Error('Failed to create or get chat: ' + (error instanceof Error ? error.message : String(error)));
    }
};

export const createGroupChat = async (creatorId: string, participantIds: string[], chatName: string) => {
    try {
        const allParticipants = [creatorId, ...participantIds];
        
        const chatData: CreateChatInput = {
            participants: allParticipants,
            chatName: chatName,
            isGroupChat: true
        };
        
        const newChat = await chatRepository.createChat(chatData);
        return newChat;
    } catch (error) {
        throw new Error('Failed to create group chat: ' + (error instanceof Error ? error.message : String(error)));
    }
};

// ===== MESSAGE SERVICE FUNCTIONS =====

export const getChatMessages = async (chatId: string, userId: string, page: number = 1) => {
    try {
        // Verify user is part of this chat
        const chat = await chatRepository.findChatById(chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }
        
        const isParticipant = chat.participants.some((p: any) => p._id.toString() === userId);
        if (!isParticipant) {
            throw new Error('User is not a participant in this chat');
        }
        
        const messages = await chatRepository.findMessagesByChatId(chatId, page);
        
        // Transform messages for frontend
        const transformedMessages: MessageWithSender[] = messages.map((message: any) => ({
            _id: message._id.toString(),
            chatId: message.chatId.toString(),
            senderId: message.senderId._id.toString(),
            senderName: message.senderId.username,
            text: message.text,
            messageType: message.messageType,
            isRead: message.isRead,
            readBy: message.readBy.map((id: any) => id.toString()),
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
        }));
        
        return transformedMessages.reverse(); // Show oldest first
    } catch (error) {
        throw new Error('Failed to get chat messages: ' + (error instanceof Error ? error.message : String(error)));
    }
};

export const sendMessage = async (messageData: SendMessageInput) => {
    try {
        // Verify chat exists and user is participant
        const chat = await chatRepository.findChatById(messageData.chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }
        
        const isParticipant = chat.participants.some((p: any) => p._id.toString() === messageData.senderId);
        if (!isParticipant) {
            throw new Error('User is not a participant in this chat');
        }
        
        // Create the message
        const message = await chatRepository.createMessage(messageData);
        
        // Update chat's last message
        await chatRepository.updateChatLastMessage(messageData.chatId, message._id);
        
        return message;
    } catch (error) {
        throw new Error('Failed to send message: ' + (error instanceof Error ? error.message : String(error)));
    }
};

export const markMessagesAsRead = async (chatId: string, userId: string) => {
    try {
        // Verify user is part of this chat
        const chat = await chatRepository.findChatById(chatId);
        if (!chat) {
            throw new Error('Chat not found');
        }
        
        const isParticipant = chat.participants.some((p: any) => p._id.toString() === userId);
        if (!isParticipant) {
            throw new Error('User is not a participant in this chat');
        }
        
        await chatRepository.markAllMessagesAsRead(chatId, userId);
        return { message: 'Messages marked as read' };
    } catch (error) {
        throw new Error('Failed to mark messages as read: ' + (error instanceof Error ? error.message : String(error)));
    }
};