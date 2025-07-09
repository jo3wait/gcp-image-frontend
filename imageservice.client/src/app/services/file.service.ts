import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FileDto {
  Id: string;
  FileName: string;
  OriSizeKb: string;   // 上傳時 KB
  CompSizeKb: string;  // 縮圖完成 KB；若未完成為空
  UploadDate: string;
  Status: string;      // processing | done | fail
  ThumbUrl?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class FileService {
  private readonly base = `${environment.imageApi}/api/image`;
  constructor(private http: HttpClient) { }

  list(): Observable<FileDto[]> {
    return this.http.get<FileDto[]>(`${this.base}/list`);
  }

  upload(file: File): Observable<UploadResponse> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<UploadResponse>(`${this.base}/upload`, form);
  }
}
