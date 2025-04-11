import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, Post, Comment } from '../services/user.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post.component.html'
})
export class PostComponent {
  posts: Post[] = [];
  newPostContent = '';
  newComment: { [postId: number]: string } = {};
  editingPost: Post | null = null;
  editingCommentIndex: { [postId: number]: number | null } = {};
  editedCommentContent: { [postId: number]: string } = {};
  currentUser: ReturnType<UserService['getCurrentUser']>;

  constructor(private userService: UserService) {
    this.currentUser = this.userService.getCurrentUser();
    this.loadPosts();
  }

  loadPosts() {
    this.posts = this.userService.getAllPosts();
    this.currentUser = this.userService.getCurrentUser();
  }

  addPost() {
    const user = this.userService.getCurrentUser();
    if (!user) return alert('Zaloguj się');
    const trimmedContent = this.newPostContent.trim();
    if (!trimmedContent) return alert('Treść posta nie może być pusta');

    const post: Post = {
      id: 0,
      author: user.email,
      content: trimmedContent,
      comments: []
    };
    this.userService.savePost(post);
    this.newPostContent = '';
    this.loadPosts();
  }

  deletePost(id: number) {
    if (confirm('Usunąć post?')) {
      this.userService.deletePost(id);
      this.loadPosts();
    }
  }

  editPost(post: Post) {
    this.editingPost = { ...post };
  }

  saveEdit() {
    if (this.editingPost) {
      const trimmed = this.editingPost.content.trim();
      if (!trimmed) return alert('Treść nie może być pusta');
      this.editingPost.content = trimmed;
      this.userService.savePost(this.editingPost);
      this.editingPost = null;
      this.loadPosts();
    }
  }

  addComment(postId: number) {
    const user = this.userService.getCurrentUser();
    if (!user) return alert('Zaloguj się');
    const content = this.newComment[postId]?.trim();
    if (!content) return;
    const comment: Comment = {
      author: user.email,
      content
    };
    this.userService.addComment(postId, comment);
    this.newComment[postId] = '';
    this.loadPosts();
  }

  startEditComment(postId: number, index: number, content: string) {
    this.editingCommentIndex[postId] = index;
    this.editedCommentContent[postId] = content;
  }

  saveCommentEdit(postId: number) {
    const index = this.editingCommentIndex[postId];
    const newContent = this.editedCommentContent[postId]?.trim();
    if (index != null && newContent) {
      this.userService.editComment(postId, index, newContent);
      this.editingCommentIndex[postId] = null;
      this.editedCommentContent[postId] = '';
      this.loadPosts();
    }
  }

  deleteComment(postId: number, index: number) {
    if (confirm('Usunąć komentarz?')) {
      this.userService.deleteComment(postId, index);
      this.loadPosts();
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}