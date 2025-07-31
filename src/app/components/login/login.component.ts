import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;

  constructor(private router: Router) {}

  onLogin() {
    if (this.email && this.password) {
      this.router.navigate(['/approved-funding']);
    } else {
      // Navigate to approved-funding even without credentials for now (placeholder login)
      this.router.navigate(['/approved-funding']);
    }
  }

  goToReset(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    // Navigate to reset password when implemented
    console.log('Reset password functionality to be implemented');
  }

  goToRegister(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    console.log('Navigating to register...');
    this.router.navigate(['/register']);
  }
}