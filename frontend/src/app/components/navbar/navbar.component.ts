import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for ngIf
import { RouterLink, Router } from '@angular/router'; // Required for routerLink
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true, // Mark as standalone
  imports: [CommonModule, RouterLink], // Import CommonModule for directives like ngIf, RouterLink for navigation
  templateUrl: './navbar.component.html',
  styleUrls: [],
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  isInstructor(): boolean {
    return this.currentUser?.role === 'instructor';
  }

  isStudent(): boolean {
    return this.currentUser?.role === 'student';
  }
}
