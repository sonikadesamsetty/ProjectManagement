import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Story } from './models/story';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  unsubscribeFromStory(obj: { storyId: number; userEmail: string[]; }) {
    return this.httpClient.delete('http://localhost:8080/stories/subscriptions', { body: obj });
  }
  
  subscribeToStory(obj: { storyId: number; userEmail: any; }) {
    return this.httpClient.post('http://localhost:8080/stories/subscriptions', obj);
  }
  
  
  constructor() { }

  httpClient = inject(HttpClient);
 
  getStories(): Observable<Story[]> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.httpClient.get<Story[]>('http://localhost:8080/stories', {
      headers
    });
  }

  addStory(story: any): Story {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    this.httpClient.post('http://localhost:8080/stories', story,{headers}).subscribe((newStory) => {
      console.log(newStory);
    }); 
    return story;
  }

  updateStory(updatedStory: Story) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
     this.httpClient.put(`http://localhost:8080/stories`, updatedStory,{headers}).subscribe((response) => {
      console.log("Story updated on server:", response);
    });
    
  }

  deleteStory(storyId: number) {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.httpClient.delete(`http://localhost:8080/stories/${storyId}`,{headers});
  }
  
  getAllSubscriptions() : Observable<any[]> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.httpClient.get<any[]>('http://localhost:8080/stories/subscriptions',{headers});
  }

}
