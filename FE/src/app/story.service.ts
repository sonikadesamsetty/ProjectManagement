import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Story } from './models/story';
import { Comment } from './models/comment';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  
  getCommentsByStoryId(id: any): Observable<Comment[]> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
     let params = new HttpParams()
    .set('storyId', id)
    .set('taskId', 0);
    //add query param storyId
    return this.httpClient.get<Comment[]>('http://localhost:8088/kanban-board/commentsById',{
      //add params and headers
      params, headers
    }
    );
  }

  getCommentsByTaskId(id: any): Observable<Comment[]> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    //add query param taskId
    return this.httpClient.get<Comment[]>('http://localhost:8088/kanban-board/comments?taskId='+id+'?storyId='+0, { headers });
  } 
   

  addStoryDiscussion(comment: Comment): Observable<Comment> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.httpClient.post<Comment>(`http://localhost:8088/kanban-board/comments`,comment, { headers });
  }
  unsubscribeFromStory(obj: { storyId: number; userEmail: string[]; }) {
    return this.httpClient.delete('http://localhost:8088/kanban-board/stories/subscriptions', { body: obj });
  }
  
  subscribeToStory(obj: { storyId: number; userEmail: any; }) {
    return this.httpClient.post('http://localhost:8088/kanban-board/stories/subscriptions', obj);
  }
  
  
  constructor() { }

  httpClient = inject(HttpClient);
 
  getStories(): Observable<Story[]> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.httpClient.get<Story[]>('http://localhost:8088/kanban-board/stories', {
      headers
    });
  }

  getStoryById(id: any): Observable<Story> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.httpClient.get<Story>('http://localhost:8088/kanban-board/stories/'+id, {
      headers
    });
  } 

  addStory(attachments: FormData): any {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      //'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    //console.log(story);
    
    
    this.httpClient.post('http://localhost:8088/kanban-board/stories',attachments,{headers}).subscribe((newStory) => {
      console.log(newStory);
    }); 
    return "Story added";
  }

  updateStory(updatedStory: Story) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
     this.httpClient.put(`http://localhost:8088/kanban-board/stories`, updatedStory,{headers}).subscribe((response) => {
      console.log("Story updated on server:", response);
    });
    
  }

  

  deleteStory(storyId: number) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.httpClient.delete(`http://localhost:8088/kanban-board/stories/${storyId}`,{headers});
  }
  
  getAllSubscriptions() : Observable<any[]> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.httpClient.get<any[]>('http://localhost:8088/kanban-board/stories/subscriptions',{headers});
  }

  updateStoryState(storyId: any, state: string) : Observable<any>{
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    return this.httpClient.put<any>(`http://localhost:8088/kanban-board/stories/updateState/${storyId}/${state}`,null,{headers});
  }

}
