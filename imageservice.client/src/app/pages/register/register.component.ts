import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  msg = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) { }

  submit(): void {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;

    this.auth.register(email!, password!).subscribe({
      next: res => {
        if (res.success) {
          this.msg = 'Registered! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 1200);
        } else {
          this.error = res.message;          // ← 顯示 API 錯誤
        }
      },
      error: () => (this.error = 'Server error') // ← 其他例外
    });
  }
}
