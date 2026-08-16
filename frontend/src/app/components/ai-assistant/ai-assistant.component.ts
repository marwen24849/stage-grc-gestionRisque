import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { AiAgentService } from '../../services/ai-agent.service';

type ChatRole = 'assistant' | 'user';

interface ChatMessage {
  role: ChatRole;
  content: string;
  safeHtml: string;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: false,
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.css']
})
export class AiAssistantComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLDivElement>;

  isOpen = false;
  inputText = '';
  isLoading = false;
  messages: ChatMessage[] = [];

  constructor(private aiAgentService: AiAgentService) {
    this.addMessage(
      'assistant',
      'Bonjour ! Je peux vous aider à analyser les clients, responsables, activités et actifs du GRC.'
    );
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleAssistant(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    const message = this.inputText.trim();

    if (!message || this.isLoading) {
      return;
    }

    this.inputText = '';
    this.addMessage('user', message);
    this.isLoading = true;

    this.aiAgentService.sendMessage(message).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.addMessage('assistant', response);
      },
      error: () => {
        this.isLoading = false;
        this.addMessage(
          'assistant',
          'Je n\'ai pas pu contacter l\'assistant IA. Vérifiez que le backend GRC est bien démarré sur http://localhost:8083.'
        );
      }
    });
  }

  onTextareaKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private addMessage(role: ChatRole, content: string): void {
    const html = this.renderMarkdown(content);
    this.messages.push({ role, content, safeHtml: html });
  }

  private renderMarkdown(content: string): string {
    const parsed = marked.parse(content, {
      breaks: true,
      gfm: true
    });

    return DOMPurify.sanitize(String(parsed ?? ''));
  }

  private scrollToBottom(): void {
    if (!this.messagesContainer) {
      return;
    }

    const element = this.messagesContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
  }
}
