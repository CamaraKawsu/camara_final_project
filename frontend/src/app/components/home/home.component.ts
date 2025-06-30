import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for ngIf and pipes
import { RouterLink } from '@angular/router'; // Required for routerLink
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-home',
  standalone: true, // Mark as standalone
  imports: [CommonModule, RouterLink], // Import CommonModule and RouterLink
  templateUrl: './home.component.html',
  styleUrls: [],
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }
}
