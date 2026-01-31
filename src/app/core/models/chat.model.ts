export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sources?: DocumentSource[];
}

export interface DocumentSource {
  fileName: string;
  content: string;
  relevanceScore: number;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  createdAt: Date;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  message: string;
  sources: DocumentSource[];
  sessionId: string;
}
