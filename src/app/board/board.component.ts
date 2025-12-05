import { DatePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { expand } from 'rxjs';
import { StoryComponent } from '../story/story.component';
import { state } from '@angular/animations';
import { StoryService } from '../story.service';
import { TaskComponent } from '../task/task.component';
import { TaskService } from '../task.service';
import { Story } from '../models/story';
import { Task } from '../models/task';
import { Project } from '../models/project';
import { ProjectService } from '../project.service';
import { SprintService } from '../sprint.service';
import { Sprint } from '../models/sprint';
import { Member } from '../models/members';
import { ProjectComponent } from '../project/project.component';
import { KanbanViewComponent } from '../kanban-view/kanban-view.component';
import { ProfileComponent } from '../profile/profile.component';
import { UserService } from '../user.service';
import { UserComponent } from '../user/user.component';
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [MatIconModule, NgIf, StoryComponent, NgStyle, TaskComponent, NgFor, RouterOutlet, ProjectComponent, KanbanViewComponent, ProfileComponent, UserComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
  projects: Project[] = [];
  stories: Story[] = [];
  allStories: Story[] = [];
  sprints: Sprint[] = [];
  allSprints: Sprint[] = [];
  tasks: Task[] = [];
  members: Member[] = [];
  allMembers: Member[] = [];
  taskBoardClicked = true;
  projectBoardClicked = false;
  storyClicked = false;
  taskClicked = false;
  storyId: number | 0 = 0;
  taskId: number | 0 = 0;
  itemType!: string;
  showMenu: boolean = false;
  boardViewClicked = false;
  profileClicked = false;
  userClicked= false;

  projectSprints!: Sprint[];
  selectedProjectId!: number;
  constructor(private router: Router) { }

  storyService = inject(StoryService);
  taskService = inject(TaskService);
  projectService = inject(ProjectService);
  sprintService = inject(SprintService);
  userService = inject(UserService);
  userEmail = '';
  ngOnInit(): void {
 this.userEmail = this.userService.getLoggedInUser();
    if(!this.userEmail) { 
      console.log("No logged in user found");
      this.router.navigateByUrl("/user");
    }
    this.loadProjects();
    this.storyService.getStories().subscribe(stories => {
      console.log(stories);
      this.stories = stories;
      this.allStories = stories;
      for (let story of this.stories) { 
        console.log(story);
        this.taskService.getTasks().subscribe(tasks => {
          console.log(tasks);
           this.stories = this.stories.map(s => {
            console.log(s.id + " " + story.id);
            if (s.id === story.id) {
              return { ...s, tasks: tasks.filter((t: { storyId: number | null; }) => t.storyId === story.id) };
              
             }
            return s;
        });
        console.log(this.stories);
      });
    }
  
  });


  }

  async loadProjects() {
    await this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      console.log(this.projects);
      this.selectedProjectId = this.projects[0].id;
      this.sprintService.getSprints().subscribe(sprints => {
      console.log(sprints);
      console.log(this.projects[0].id);
      this.allSprints = sprints;
      this.sprints = this.allSprints.filter(sprint =>{
        console.log(sprint.projectId == this.projects[0].id);
      return sprint.projectId == this.projects[0].id;
  })
    });
     this.projectService.getProjectMembers().subscribe(members=>{
      console.log(members);
      this.members = members;
      this.allMembers = members;
    })

     
  console.log(this.sprints);
    });

    
  }

  updateSprints(event: Event) {
    console.log(event);
    const selectedElement = event.target as HTMLSelectElement;
    const projectId : number= Number(selectedElement.value);
    this.selectedProjectId = projectId;
    console.log("updateSprints called with projectId: " + projectId);
    console.log(this.sprints);
    console.log(this.allSprints);
    this.sprints = this.allSprints.filter(sprint => sprint.projectId === projectId);
      console.log(this.sprints); 
    console.log(this.allMembers);
    this.members = this.allMembers.filter(member=>member.projectId === projectId);
    console.log(this.members);
  }

  updateStories(event: Event) {
    console.log(event);
    const selectedElement = event.target as HTMLSelectElement;
    const sprintId : number= Number(selectedElement.value);
    console.log("updateStories called with sprintId: " + sprintId);
    console.log(this.stories);
    this.stories = this.stories.filter(story => story.sprintId === sprintId);
      console.log(this.stories);
  }

  filterByAssignee(event: Event) {
    console.log(event);
    const selectedElement = event.target as HTMLSelectElement;
    const memberId : number= Number(selectedElement.value);
    console.log("filterByAssignee called with memberId: " + memberId);
    console.log(this.stories);
    this.stories = this.allStories.filter(story => story.assignedTo == memberId.toString());
      console.log(this.stories);
      //check if member is NaN, then show all stories
      if(memberId.toString() === 'NaN') {
        this.stories = this.allStories;
      }
  }

  filterByType(event: Event) {
    console.log(event);
    const selectedElement = event.target as HTMLSelectElement;
    const type : string= selectedElement.value;
    console.log("filterByType called with type: " + type);
    console.log(this.stories);
    if(type === 'all') {
      this.stories = this.allStories;
    } else {
      this.stories = this.allStories.filter(story => story.itemType === type);
    } 

      console.log(this.stories);
  } 

  filterByStatus(event: Event) {
    console.log(event);
    const selectedElement = event.target as HTMLSelectElement;
    const status : string= selectedElement.value;
    console.log("filterByStatus called with status: " + status);
    console.log(this.stories);
    if(status === 'all') {
      this.stories = this.allStories;
    }
    else {
      this.stories = this.allStories.filter(story => story.status === status);
    }

      console.log(this.stories);
  } 

  openStory(story: any) {
    this.storyClicked = true;
    this.storyId = story;
    console.log(this.storyId);
  }
  

  createStory(story: any) {
    this.storyClicked = true;
    this.storyId = story;
    this.itemType = 'story';
    console.log(this.storyId);
  }
  createBug(story: any) {
    this.storyClicked = true;
    this.storyId = story;
    this.itemType = 'bug';
    console.log(this.storyId);
  }

  closeStory() {
    console.log("closeStory called");
    console.log(this.storyClicked)
    this.storyClicked = false;
     this.storyService.getStories().subscribe(stories => {
      console.log(stories);
      this.stories = stories;
      for (let story of this.stories) { 
        console.log(story);
        this.taskService.getTasks().subscribe(tasks => {
          console.log(tasks);
           this.stories = this.stories.map(s => {
            console.log(s.id + " " + story.id);
            if (s.id === story.id) {
              return { ...s, tasks: tasks.filter((t: { storyId: number | null; }) => t.storyId === story.id) };
              
             }
            return s;
        });
        console.log(this.stories);
      });
    }
  
  });
  }

  addTask(task: number, storyId: number) {
    this.taskClicked = true;
    this.taskId = task;
    this.storyId = storyId;
    console.log(storyId);
    console.log(this.taskId);
  }

  openTask(task: number) {
    this.taskClicked = true;
    this.taskId = task;
    console.log(this.taskId);
  }

  closeTask() {
    console.log("closeTask called");
    console.log(this.taskClicked)
    this.taskClicked = false;
     this.storyService.getStories().subscribe(stories => {
      console.log(stories);
      this.stories = stories;
      for (let story of this.stories) { 
        console.log(story);
        this.taskService.getTasks().subscribe(tasks => {
          console.log(tasks);
           this.stories = this.stories.map(s => {
            console.log(s.id + " " + story.id);
            if (s.id === story.id) {
              return { ...s, tasks: tasks.filter((t: { storyId: number | null; }) => t.storyId === story.id) };
              
             }
            return s;
        });
        console.log(this.stories);
      });
    }
  
  });
  }

  toggleMenu() {
    console.log("toggleMenu called");
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      if (sidebar.style.display === 'none') {
        sidebar.style.display = 'block';
      } else {
        sidebar.style.display = 'none';
      }
    }
    this.showMenu = !this.showMenu;

  }

  openTaskBoard() {
    this.taskBoardClicked = true;
    this.projectBoardClicked = false;
    this.showMenu = false;
    this.boardViewClicked = false;
    this.profileClicked = false;
  }

  openProjectBoard() {
    this.projectBoardClicked = true;
    this.taskBoardClicked = false;
    this.showMenu = false;
    this.boardViewClicked = false;
    this.profileClicked = false;
  }

  openViewBoard() {
    this.projectBoardClicked = false;
    this.taskBoardClicked = false;
    this.showMenu = false;  
    this.boardViewClicked = true;
    this.profileClicked = false;
  }

  openProfile() {
    this.projectBoardClicked = false;
    this.taskBoardClicked = false;
    this.showMenu = false;  
    this.boardViewClicked = false;
    this.profileClicked = true;
  }

  openUser() {
    this.projectBoardClicked = false;
    this.taskBoardClicked = false;
    this.showMenu = false;  
    this.boardViewClicked = false;
    this.profileClicked = false;
    this.userClicked = true;
  }

  findAssigneeName(assigneeId: string): string {
    const member = this.members.find(m => m.id === Number(assigneeId));
    return member ? member.name : 'Unassigned';
  }
}
