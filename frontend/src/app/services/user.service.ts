import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/auth`; // Assuming /api/auth endpoint for users

  constructor(private http: HttpClient) {}

  // This endpoint would be a new one you need to add to your backend authRoutes
  // e.g., router.get('/users', protect, authorize(['admin']), getUsers);
  // and in authController: exports.getUsers = async (req, res) => { const users = await User.find(); res.status(200).json({success: true, data: users})}
  getUsers(): Observable<{ success: boolean; data: User[] }> {
    return this.http.get<{ success: boolean; data: User[] }>(
      `${this.apiUrl}/users`
    );
  }
}
