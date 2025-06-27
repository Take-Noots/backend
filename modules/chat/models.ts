import mongoose from 'mongoose';

// Chat/Conversation Schema
const chatSchema = new mongoose.Schema({
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }],
  chatName: { 
    type: String, 
    required: false 
  },
  isGroupChat: { 
    type: Boolean, 
    default: false 
  },
  lastMessage: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message',
    required: false 
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Message Schema
const messageSchema = new mongoose.Schema({
  chatId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Chat', 
    required: true 
  },
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  messageType: { 
    type: String, 
    enum: ['text', 'image', 'audio'], 
    default: 'text' 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  readBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create indexes for better performance
chatSchema.index({ participants: 1 });
chatSchema.index({ updatedAt: -1 });
messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });

export const Chat = mongoose.model('Chat', chatSchema);
export const Message = mongoose.model('Message', messageSchema);