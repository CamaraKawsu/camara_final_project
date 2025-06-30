import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component'; // Import the standalone Navbar

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent], // Import Navbar here
  template: `
    <app-navbar></app-navbar>
    <main class="container-fluid py-4">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.component.css', // You can add global app styles here or in styles.css
})
export class AppComponent {
  title = 'school-management-frontend-simple';
}
