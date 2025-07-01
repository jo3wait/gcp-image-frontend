import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FileDto {
  id: string;
  fileName: string;
  size: string;
  uploadDate: string;
  status: string;      // processing | done | fail
  thumbUrl?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class FileService {
  constructor(private http: HttpClient) { }

  list(): Observable<FileDto[]> {
    return this.http.get<FileDto[]>('/api/image/list');
  }

  upload(file: File): Observable<UploadResponse> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<UploadResponse>('/api/image/upload', form);
  }
}
