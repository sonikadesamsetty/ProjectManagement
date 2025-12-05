import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

    constructor() { }

    httpClient = inject(HttpClient);

    public uploadAttachments(storyId: any, addedFiles: File[]) : Observable<any> {
        const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + token
        });
        const formData: FormData = new FormData();
        for (let i = 0; i < addedFiles.length; i++) {
            formData.append('attachments', addedFiles[i]);
        }
        return this.httpClient.post('http://localhost:8088/kanban-board/stories/' + storyId + '/attachments', formData, { headers });
    }

    public deleteAttachments(storyId: number, removedFiles: number[]): Observable<any> {
        const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        const removedFileIds =  removedFiles ;
        const formData: FormData = new FormData();
        formData.append('fileIds', JSON.stringify(removedFiles));
        return this.httpClient.delete(
            'http://localhost:8088/kanban-board/stories/attachments', { body: removedFileIds, headers });
    }

}