import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) { }

  submit(): void {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;

    this.auth.login(email!, password!).subscribe({
      next: res => {
        if (res.success) {
          this.router.navigate(['/images']);
        } else {
          this.error = res.message;          // ← 顯示 API 錯誤
        }
      },
      error: () => (this.error = 'Server error') // ← 其他例外
    });
  }

  clear(): void {
    this.form.reset();
    this.error = '';
  }
}
