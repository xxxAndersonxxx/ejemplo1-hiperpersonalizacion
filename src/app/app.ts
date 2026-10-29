import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
  //  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  imports: [CommonModule, DashboardComponent], // Agrégalo en los imports
  template: `<app-dashboard></app-dashboard>`, // Llama al selector de tu componente
})
export class App {
  protected readonly title = signal('hyper-agent-app');
}
