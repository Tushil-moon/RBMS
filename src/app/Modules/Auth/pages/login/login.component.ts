import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../Services/Auth/auth.service';
import { SignUpUser } from '../../models/user';
import { NotificationService } from '../../../../Services/Notification/notification.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule,TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);

  /**
   * Form Intialization
   */
  loginForm: FormGroup = this.fb.group({
    email: this.fb.control('', Validators.required),
    password: this.fb.control('', Validators.required),
  });

  /**
   * Handle user login
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (user: SignUpUser[]) => {
          const data = user[0];
          if (data) {
            if (
              data.email === this.loginForm.value.email &&
              data.password == this.loginForm.value.password
            ) {
              console.log(data);
              sessionStorage.setItem('loginUser', JSON.stringify(data));
              this.router.navigate(['/dashboard'], { state: { user: data } });
              this.notification.success('Login successfully!');
            } else {
              this.notification.error('Invalid credential!');
            }
          } else {
            this.loginForm.reset();
            this.notification.error('Invalid credential!');
          }
        },
        (err) => {
          this.notification.error('Invalid credential!');
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
      this.notification.warning('Fill all required field!');
    }
  }
}
