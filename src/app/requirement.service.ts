import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Requirement, Status, Comment } from './models';

@Injectable({ providedIn: 'root' })
export class RequirementService {
  private http = inject(HttpClient);
  // This URL will be our target. We will build the backend for it next.
  private apiUrl = 'http://localhost:3001/api/requirements';

  /**
   * GET: Fetch all requirements from the server
   */
  getRequirements(): Observable<Requirement[]> {
    return this.http.get<Requirement[]>(this.apiUrl).pipe(
      // Dates from JSON are strings, so we convert them back to Date objects
      tap(reqs => reqs.forEach(r => {
        r.dueDate = new Date(r.dueDate);
        r.comments.forEach(c => c.timestamp = new Date(c.timestamp));
      }))
    );
  }

  /**
   * PUT: Update the status of a requirement
   */
  updateRequirementStatus(id: string, status: Status): Observable<Requirement> {
    return this.http.put<Requirement>(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * POST: Add a comment to a requirement
   */
  addComment(requirementId: string, commentData: { content: string }): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${requirementId}/comments`, commentData).pipe(
      // The backend returns a comment with a string timestamp, so we convert it.
      tap(comment => comment.timestamp = new Date(comment.timestamp))
    );
  }

  // We can add more methods later, like:
  // getRequirementById(id: string): Observable<Requirement>
  // createRequirement(data: Omit<Requirement, 'id'>): Observable<Requirement>
}