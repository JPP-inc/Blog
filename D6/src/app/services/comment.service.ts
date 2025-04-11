import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:3000/api/comments';

  constructor(private http: HttpClient) {}

 
  addComment(postId: string, newComment: { content: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/post/${postId}/comment`, newComment);
  }
}
