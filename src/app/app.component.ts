import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-toolbar">
        <mat-icon>chat</mat-icon>
        <span class="app-title">Resume Chat Assistant</span>
        <span class="spacer"></span>
        <mat-icon class="info-icon">info</mat-icon>
      </mat-toolbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .app-title {
      margin-left: 16px;
      font-size: 20px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .info-icon {
      cursor: pointer;
    }

    .main-content {
      margin-top: 64px;
      height: calc(100vh - 64px);
      overflow: hidden;
    }
  `]
})
export class AppComponent {
  title = 'Resume Chat';
}
