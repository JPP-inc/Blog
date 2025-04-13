import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  users: User[] = [];
  editingUser: User | null = null;

  constructor(private userService: UserService) {
    this.loadUsers();
  }

  loadUsers() {
    this.users = this.userService.getAllUsers();
  }

  editUser(user: User) {
    this.editingUser = { ...user };
  }

  saveUser() {
    if (this.editingUser) {
      this.userService.setUser(this.editingUser);
      this.editingUser = null;
      this.loadUsers();
    }
  }

  cancelEdit() {
    this.editingUser = null;
  }

  deleteUser(user: User) {
    if (confirm(`Usunąć konto ${user.email}?`)) {
      this.userService.deleteUser(user.email);
      this.loadUsers();
    }
  }
}
