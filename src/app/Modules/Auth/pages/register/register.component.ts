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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule,TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);

  /**
   * Form initialization
   */
  signupForm: FormGroup = this.fb.group({
    role: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /**
   * Handle user Signup
   */
  onSubmit(): void {
    if (this.signupForm.valid) {
      this.authService.register(this.signupForm.value).subscribe(
        (res: SignUpUser) => {
          console.log(res);
          this.signupForm.reset({
            role: '',
            email: '',
            username: '',
            password: '',
          });
          this.notification.success('Register successfully!');
          this.router.navigate(['/login']);
        },
        (err) => {
          console.log(err);
          this.notification.error(
            'Error while registration, Please try again later!'
          );
        }
      );
    } else {
      this.signupForm.markAllAsTouched();
      this.notification.warning('Fill all required field!');
    }
  }
}
