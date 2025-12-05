import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sprint } from './models/sprint';

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  
  constructor() { }

  httpClient = inject(HttpClient);

  getSprints() : Observable<Sprint[]> {
    const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    return this.httpClient.get<Sprint[]>('http://localhost:8088/kanban-board/sprints',{headers});
  }

  createSprint(sprint: Sprint): Observable<Sprint> {
    const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    return this.httpClient.post<Sprint>('http://localhost:8088/kanban-board/sprints',sprint,{headers});
  }

  deleteSprint(id: any) {
    const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    return this.httpClient.delete(`http://localhost:8088/kanban-board/sprints/${id}`,{headers});
  }

  updateSprint(sprint: Sprint) {
    const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    return this.httpClient.put('http://localhost:8088/kanban-board/sprints',sprint,{headers});
  }
  

}
