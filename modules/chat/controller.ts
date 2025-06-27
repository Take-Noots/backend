import { Request, Response } from 'express';
import * as chatService from './service';


const GetUserConversations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user; // From JWT middleware
        
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const conversations = await chatService.getUserConversations(userId);
        
        res.status(200).json({
            message: 'Conversations retrieved successfully',
            conversations: conversations
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to get conversations',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

const CreateOrGetChat = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user; // From JWT middleware
        const { otherUserId } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        if (!otherUserId) {
            res.status(400).json({ message: 'Other user ID is required' });
            return;
        }

        if (userId === otherUserId) {
            res.status(400).json({ message: 'Cannot create chat with yourself' });
            return;
        }

        const chat = await chatService.createOrGetChat(userId, otherUserId);
        
        res.status(201).json({
            message: 'Chat created or retrieved successfully',
            chat: chat
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to create or get chat',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

const CreateGroupChat = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user; // From JWT middleware
        const { participantIds, chatName } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
            res.status(400).json({ message: 'Participant IDs are required' });
            return;
        }

        if (!chatName || chatName.trim() === '') {
            res.status(400).json({ message: 'Chat name is required for group chats' });
            return;
        }

        const chat = await chatService.createGroupChat(userId, participantIds, chatName.trim());
        
        res.status(201).json({
            message: 'Group chat created successfully',
            chat: chat
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to create group chat',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

//MESSAGE CONTROLLERS 

const GetChatMessages = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user; // From JWT middleware
        const { chatId } = req.params;
        const page = parseInt(req.query.page as string) || 1;

        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        if (!chatId) {
            res.status(400).json({ message: 'Chat ID is required' });
            return;
        }

        const messages = await chatService.getChatMessages(chatId, userId, page);
        
        res.status(200).json({
            message: 'Messages retrieved successfully',
            messages: messages,
            page: page
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to get chat messages',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

const SendMessage = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user; // From JWT middleware
        const { chatId, text, messageType } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        if (!chatId) {
            res.status(400).json({ message: 'Chat ID is required' });
            return;
        }

        if (!text || text.trim() === '') {
            res.status(400).json({ message: 'Message text is required' });
            return;
        }

        const messageData = {
            chatId: chatId,
            senderId: userId,
            text: text.trim(),
            messageType: messageType || 'text'
        };

        const message = await chatService.sendMessage(messageData);
        
        res.status(201).json({
            message: 'Message sent successfully',
            data: message
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to send message',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

const MarkMessagesAsRead = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user; // From JWT middleware
        const { chatId } = req.params;

        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        if (!chatId) {
            res.status(400).json({ message: 'Chat ID is required' });
            return;
        }

        const result = await chatService.markMessagesAsRead(chatId, userId);
        
        res.status(200).json({
            message: 'Messages marked as read successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to mark messages as read',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export { 
    GetUserConversations, 
    CreateOrGetChat, 
    CreateGroupChat,
    GetChatMessages, 
    SendMessage, 
    MarkMessagesAsRead 
};