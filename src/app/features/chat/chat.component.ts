import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ChatMessage, ChatRequest } from '../../core/models/chat.model';
import { ChatService } from '../../core/services/chat.service';
import { SignalRService } from '../../core/services/signalr.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatMenuModule,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  userInput = '';
  isLoading = false;
  sessionId = '';
  viewMode: 'all' | 'companies' | 'projects' = 'all';
  private destroy$ = new Subject<void>();

  quickLinks = [
    {
      label: 'GitHub (Source Control)',
      note: 'Public repository',
      url: 'https://github.com/your-username',
      icon: 'code',
    },
    {
      label: 'GitLab (Local Source Control)',
      note: 'Self-hosted instance',
      url: 'https://gitlab.your-domain.local/your-username',
      icon: 'storage',
    },
    {
      label: 'Download Resume',
      note: 'Azure Storage (PDF)',
      url: 'https://<storage-account>.blob.core.windows.net/<container>/JuanPabloBetancourt_Resume.pdf',
      icon: 'download',
      downloadName: 'JuanPabloBetancourt_Resume.pdf',
    },
    {
      label: 'LinkedIn',
      note: 'Professional profile',
      url: 'https://www.linkedin.com/in/your-handle',
      icon: 'person',
    },
  ];

  companies = [
    {
      name: 'Acclaim Systems Inc',
      url: 'https://www.acclaimsystems.com',
      logo: 'assets/logos/acclaim-systems.svg',
      projects: ['Project portfolio', 'Cloud modernization', 'AI enablement'],
    },
    {
      name: 'Asisprin S.A.S',
      url: 'https://www.asisprin.com',
      logo: 'assets/logos/asisprin.svg',
      projects: ['Enterprise systems', 'Process automation', 'Data platforms'],
    },
    {
      name: 'Sinco Comunicaciones',
      url: 'https://www.sinco.co',
      logo: 'assets/logos/sinco.svg',
      projects: ['Telecom integration', 'Network observability', 'Service portals'],
    },
    {
      name: 'Jupabequi LLC',
      url: 'https://www.jupabequi.com',
      logo: 'assets/logos/jupabequi.svg',
      projects: ['AI resume platform', 'Azure RAG services', 'Conversational UI'],
    },
  ];

  projects = [
    {
      name: 'AI Resume Chat Experience',
      company: 'Jupabequi LLC',
      summary: 'Multi-channel assistant with RAG + agent workflows.',
      url: 'https://www.jupabequi.com',
    },
    {
      name: 'Azure Search Modernization',
      company: 'Acclaim Systems Inc',
      summary: 'Search reindexing, pipelines, and analytics dashboards.',
      url: 'https://www.acclaimsystems.com',
    },
    {
      name: 'Business Process Automation',
      company: 'Asisprin S.A.S',
      summary: 'Workflow optimization with secure integrations.',
      url: 'https://www.asisprin.com',
    },
    {
      name: 'Telecom Service Portal',
      company: 'Sinco Comunicaciones',
      summary: 'Customer portals and service monitoring.',
      url: 'https://www.sinco.co',
    },
  ];

  constructor(
    private chatService: ChatService,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.initializeSession();
    this.subscribeToMessages();
    this.addWelcomeMessage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.signalRService.disconnect();
  }

  private initializeSession(): void {
    this.chatService
      .createNewSession()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.sessionId = response.sessionId;
        },
        error: (error) => {
          console.error('Error creating session:', error);
        },
      });
  }

  private subscribeToMessages(): void {
    this.signalRService.message$.pipe(takeUntil(this.destroy$)).subscribe((message) => {
      if (message) {
        this.messages.push(message);
        this.scrollToBottom();
      }
    });
  }

  private addWelcomeMessage(): void {
    const welcomeMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content:
        'Hello! I am Juan Pablo Betancourt AI. Ask me anything about my background, experience, projects, or skills!\n\n💡 Try asking:\n• "What are your technical skills?"\n• "Tell me about your experience with Azure"\n• "What projects have you worked on?"\n• "What is your educational background?"\n• "Describe your leadership experience"',
      isUser: false,
      timestamp: new Date(),
    };
    this.messages.push(welcomeMessage);
  }

  sendMessage(): void {
    if (!this.userInput.trim() || this.isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: this.userInput,
      isUser: true,
      timestamp: new Date(),
    };

    this.messages.push(userMessage);
    this.scrollToBottom();

    const request: ChatRequest = {
      message: this.userInput,
      sessionId: this.sessionId,
    };

    this.userInput = '';
    this.isLoading = true;

    this.chatService
      .sendMessage(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const aiMessage: ChatMessage = {
            id: crypto.randomUUID(),
            content: response.message,
            isUser: false,
            timestamp: new Date(),
            sources: response.sources,
          };
          this.messages.push(aiMessage);
          this.isLoading = false;
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('Error sending message:', error);
          const errorMessage: ChatMessage = {
            id: crypto.randomUUID(),
            content: 'Sorry, I encountered an error. Please try again.',
            isUser: false,
            timestamp: new Date(),
          };
          this.messages.push(errorMessage);
          this.isLoading = false;
          this.scrollToBottom();
        },
      });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.messages = [];
    this.addWelcomeMessage();
    this.initializeSession();
  }

  setViewMode(mode: 'all' | 'companies' | 'projects'): void {
    this.viewMode = mode;
  }
}
