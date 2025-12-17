import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/api/users';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
