import { Injectable } from '@angular/core';

export interface User {
  email: string;
  password: string;
  name: string;
}

export interface Post {
  id: number;
  author: string;
  content: string;
  comments: Comment[];
}

export interface Comment {
  author: string;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private storageKey = 'users';
  private currentKey = 'currentUser';
  private postsKey = 'posts';

  getAllUsers(): User[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  getUserByEmail(email: string): User | undefined {
    return this.getAllUsers().find(user => user.email === email);
  }

  setUser(user: User): void {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  deleteUser(email: string): void {
    const users = this.getAllUsers().filter(u => u.email !== email);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  validateLogin(email: string, password: string): boolean {
    const user = this.getUserByEmail(email);
    return !!user && user.password === password;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem(this.currentKey, JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.currentKey);
    return data ? JSON.parse(data) : null;
  }

  logout(): void {
    localStorage.removeItem(this.currentKey);
  }

  // --- POSTY ---
  getAllPosts(): Post[] {
    const data = localStorage.getItem(this.postsKey);
    return data ? JSON.parse(data) : [];
  }

  savePost(post: Post): void {
    const posts = this.getAllPosts();
    const index = posts.findIndex(p => p.id === post.id);
    if (index > -1) {
      posts[index] = post;
    } else {
      post.id = Date.now();
      posts.push(post);
    }
    localStorage.setItem(this.postsKey, JSON.stringify(posts));
  }

  deletePost(id: number): void {
    const posts = this.getAllPosts().filter(p => p.id !== id);
    localStorage.setItem(this.postsKey, JSON.stringify(posts));
  }

  addComment(postId: number, comment: Comment): void {
    const posts = this.getAllPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.comments.push(comment);
      this.savePost(post);
    }
  }

  editComment(postId: number, index: number, newContent: string) {
    const posts = this.getAllPosts();
    const post = posts.find(p => p.id === postId);
    if (post && post.comments[index]) {
      post.comments[index].content = newContent;
      this.savePost(post);
    }
  }

  deleteComment(postId: number, index: number) {
    const posts = this.getAllPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.comments.splice(index, 1);
      this.savePost(post);
    }
  }
}