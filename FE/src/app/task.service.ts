import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from './models/task';
import { Comment } from './models/comment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  addStoryDiscussion(comment: Comment) {
    throw new Error('Method not implemented.');
  }
  
  

  constructor() { }
  httpClient = inject(HttpClient);
  

  getTasks(): Observable<Task[]> {
    const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    return this.httpClient.get<Task[]>('http://localhost:8088/kanban-board/tasks',{headers});
  }

  addTask(task: any): boolean {
    const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    this.httpClient.post('http://localhost:8088/kanban-board/tasks', task,{headers}).subscribe((newTask) => {
     console.log(newTask);
    }); 
    return true;
  }

  updateTask(task:any) {
    const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    console.log("task to be update: " , task);
    return this.httpClient.put(`http://localhost:8088/kanban-board/tasks`, task,{headers});
  }

  getTask(taskId: any) {
    const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    return this.httpClient.get<Task>(`http://localhost:8088/kanban-board/tasks/${taskId}`,{headers});
    
  }

  deleteTask(taskId: number) {
    const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    return this.httpClient.delete(`http://localhost:8088/kanban-board/tasks/${taskId}`,{headers});
  }

  getCommentsByTaskId(id: any): Observable<Comment[]> {
      const token = localStorage.getItem("token");
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      });
      let params = new HttpParams()
          .set('storyId', 0)
          .set('taskId', id);
          //add query param storyId
          return this.httpClient.get<Comment[]>('http://localhost:8088/kanban-board/commentsById',{
            //add params and headers
            params, headers
          }
          );
        }
     
  
    addTaskDiscussion(comment: Comment): Observable<Comment> {
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
}
