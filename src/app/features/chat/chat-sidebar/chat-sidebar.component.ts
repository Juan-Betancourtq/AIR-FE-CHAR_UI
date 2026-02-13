import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type ChatViewMode = 'all' | 'companies' | 'projects';

type QuickLink = {
  label: string;
  note: string;
  url: string;
  icon: string;
  downloadName?: string | null;
};

type CompanyCard = {
  name: string;
  url: string;
  logo: string;
  projects: string[];
};

type ProjectCard = {
  name: string;
  company: string;
  summary: string;
  url: string;
};

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss'],
})
export class ChatSidebarComponent {
  @Input() viewMode: ChatViewMode = 'all';
  @Input() quickLinks: QuickLink[] = [];
  @Input() companies: CompanyCard[] = [];
  @Input() projects: ProjectCard[] = [];
}
