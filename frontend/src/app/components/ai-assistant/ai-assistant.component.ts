import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild
} from '@angular/core';
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
export class AiAssistantComponent implements AfterViewChecked, AfterViewInit, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLDivElement>;

  isOpen = false;
  isExpanded = false;
  inputText = '';
  isLoading = false;
  messages: ChatMessage[] = [];

  constructor(
    private aiAgentService: AiAgentService,
    private elementRef: ElementRef<HTMLElement>
  ) {
    this.addMessage(
      'assistant',
      'Bonjour ! Je peux vous aider à analyser les clients, responsables, activités et actifs du GRC.'
    );
  }

  ngAfterViewInit(): void {
    
    
    
    this.elementRef.nativeElement.addEventListener('click', this.handleBodyClick);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.elementRef.nativeElement.removeEventListener('click', this.handleBodyClick);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isExpanded) {
      this.isExpanded = false;
    } else if (this.isOpen) {
      this.isOpen = false;
    }
  }

  toggleAssistant(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.isExpanded = false;
    }
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
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

    const sanitized = DOMPurify.sanitize(String(parsed ?? ''));
    return this.wrapCodeBlocks(sanitized);
  }

  
  
  
  
  private wrapCodeBlocks(html: string): string {
    const template = document.createElement('template');
    template.innerHTML = html;

    template.content.querySelectorAll('pre > code').forEach((codeEl) => {
      const pre = codeEl.parentElement as HTMLElement;
      const langMatch = codeEl.className.match(/language-(\w+)/);
      const lang = langMatch ? langMatch[1] : 'texte';

      const wrapper = document.createElement('div');
      wrapper.className = 'code-block';

      const header = document.createElement('div');
      header.className = 'code-block-header';
      header.innerHTML =
        `<span class="code-lang">${lang}</span>` +
        `<button type="button" class="copy-code-btn"><i class="bi bi-clipboard"></i> Copier</button>`;

      pre.replaceWith(wrapper);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });

    return template.innerHTML;
  }

  
  
  private handleBodyClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const button = target.closest('.copy-code-btn') as HTMLButtonElement | null;
    if (!button) {
      return;
    }

    const codeEl = button.closest('.code-block')?.querySelector('code');
    if (!codeEl) {
      return;
    }

    navigator.clipboard.writeText(codeEl.textContent || '').then(() => {
      const original = button.innerHTML;
      button.innerHTML = '<i class="bi bi-check2"></i> Copié';
      button.classList.add('copied');
      setTimeout(() => {
        button.innerHTML = original;
        button.classList.remove('copied');
      }, 1500);
    });
  };

  private scrollToBottom(): void {
    if (!this.messagesContainer) {
      return;
    }

    const element = this.messagesContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
  }
}