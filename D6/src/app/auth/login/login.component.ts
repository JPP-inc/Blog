import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private userService: UserService, private router: Router) {}

  login() {
    if (this.userService.validateLogin(this.email, this.password)) {
      const user = this.userService.getUserByEmail(this.email);
      if (user) {
        this.userService.setCurrentUser(user);
        alert('Zalogowano pomyślnie');
        this.router.navigate(['/profile']);
      }
    } else {
      this.error = 'Nieprawidłowy email lub hasło.';
    }
  }
}
