import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileService, FileDto } from '../../services/file.service';
import { AuthService } from '../../services/auth.service';
import { Subscription, interval, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit, OnDestroy {
  rows: FileDto[] = [];
  file?: File;
  msg = '';
  err = '';
  private pollSub?: Subscription;

  constructor(private fs: FileService, private auth: AuthService) { }

  ngOnInit(): void {
    this.refresh();

    /*輪詢後端查看壓縮狀態 (每 8 秒) */
    this.pollSub = interval(8000)
      .pipe(
        switchMap(() => this.fs.list()),
        tap(list => (this.rows = list))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  selectFile(event: any): void {
    const f = event.target.files[0];
    this.file = f;
    this.msg = this.err = '';
  }

  upload(): void {
    if (!this.file) return;
    if (this.file.size > 5 * 1024 * 1024) {
      this.err = 'File exceeds 5 MB.';
      return;
    }
    this.fs.upload(this.file).subscribe({
      next: res => {
        if (res.success) {
          this.msg = 'Upload success.';
          this.err = '';
          this.refresh();  // 立即更新
        } else {
          this.err = res.message;
        }
      },
      error: () => (this.err = 'Server error')
    });
  }

  private refresh(): void {
    this.fs.list().subscribe({
      next: list => (this.rows = list),
      error: () => (this.err = 'Server error')
    });
  }

  get email(): string | null {
    return this.auth.userEmail;
  }

  logout(): void {
    this.auth.logout();
  }
}
