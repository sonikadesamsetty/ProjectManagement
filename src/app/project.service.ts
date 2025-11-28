import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from './models/project';
import { Member } from './models/members';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
 
  
  constructor() { }

  httpClient = inject(HttpClient);

  getProjects(): Observable<Project[]> {
    const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    return this.httpClient.get<Project[]>("http://localhost:8081/projects",{headers});
  }

  getProjectMembers(): Observable<Member[]> {
    const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    return this.httpClient.get<Member[]>("http://localhost:8081/members",{headers});
  }

   addProject(newProject: Project): Observable<Project> {
    const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    return this.httpClient.post<Project>("http://localhost:8081/projects", newProject,{headers});
  }

  deleteProject(project: any): Observable<Project> {
    const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    return this.httpClient.delete<Project>("http://localhost:8081/projects/" + project.id,{headers});
  }

   updateProject(updatedProject: Project) {
    const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    return this.httpClient.put<Project>("http://localhost:8081/projects/" + updatedProject.id, updatedProject,{headers});
  }

  updateProjectMembers(updatedMembers: Member[]): Observable<Member[]> {
    const token = localStorage.getItem("token");
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        });
    return this.httpClient.put<Member[]>("http://localhost:8081/members", updatedMembers,{headers});
  }
}
