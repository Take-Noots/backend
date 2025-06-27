import { Router } from "express";
import { 
    GetUserConversations, 
    CreateOrGetChat, 
    CreateGroupChat,
    GetChatMessages, 
    SendMessage, 
    MarkMessagesAsRead 
} from "./controller";

const router = Router();

// ===== CHAT ROUTES =====

// Get all conversations for the logged-in user
router.get('/conversations', GetUserConversations);

// Create a new chat or get existing chat between two users
router.post('/conversations', CreateOrGetChat);

// Create a new group chat
router.post('/conversations/group', CreateGroupChat);

// ===== MESSAGE ROUTES =====

// Get messages for a specific chat
router.get('/conversations/:chatId/messages', GetChatMessages);

// Send a new message
router.post('/messages', SendMessage);

// Mark all messages in a chat as read
router.put('/conversations/:chatId/read', MarkMessagesAsRead);

export default router;