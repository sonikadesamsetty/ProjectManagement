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
  selectedStories: Story[] = [];
  sprintStories: Story[] = [];
  allStories: Story[] = [];
  sprintsFilteredByProject: Sprint[] = [];
  allSprints: Sprint[] = [];
  tasks: Task[] = [];
  members: Member[] = [];
  allMembers: Member[] = [];
  listViewClicked = true;
  projectBoardClicked = false;
  storyClicked = false;
  taskClicked = false;
  storyId: number | 0 = 0;
  taskId: number | 0 = 0;
  itemType!: string;
  showMenu: boolean = false;
  boardViewClicked = false;
  profileClicked = false;
  userClicked = false;

  projectSprints!: Sprint[];
  selectedProjectId!: number;
  selectedSprintId!: number;
  selectedMemberId = 0;
  selectedType = "all";
  selectedStatus = "all";
  constructor(private router: Router) { }

  storyService = inject(StoryService);
  taskService = inject(TaskService);
  projectService = inject(ProjectService);
  sprintService = inject(SprintService);
  userService = inject(UserService);
  userEmail = '';
  ngOnInit(): void {
    this.userEmail = localStorage.getItem("user") || '';
    if (!this.userEmail) {
      console.log("No logged in user found");
      this.router.navigateByUrl("/user");
    }
    this.loadStoriesAndTasks();
  }

  private async loadStoriesAndTasks() {
     this.loadProjectsAndSprints();
     //wait util selectedSprintId is defined
    if (!this.selectedSprintId) {
      setTimeout(() => {
        this.loadStoriesAndTasks();
      }, 100);  
      return;
    }

    await this.storyService.getStories().subscribe(stories => {
      console.log(stories);
      console.log(this.selectedSprintId);
      this.selectedStories = stories.filter(story => story.sprintId === this.selectedSprintId);
      this.allStories = stories;
      console.log(this.selectedStories);
      for (let story of this.selectedStories) {
        console.log(story);
        this.taskService.getTasks().subscribe(tasks => {
          console.log(tasks);
          this.selectedStories = this.selectedStories.map(s => {
            console.log(s.id + " " + story.id);
            if (s.id === story.id) {
              return { ...s, tasks: tasks.filter((t: { storyId: number | null; }) => t.storyId === story.id) };

            }
            return s;
          });
          console.log(this.selectedStories);
        });
      }

    });
  }

  async loadProjectsAndSprints() {
    await this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      console.log(this.projects);
      //select first project by default
      this.selectedProjectId = this.projects[0].id;
      this.loadSprints();
      console.log(this.sprintsFilteredByProject);
    });
    this.projectService.getProjectMembers().subscribe(members => {
      console.log(members);
      this.members = members.filter(member => member.projectId === this.selectedProjectId);
    console.log(this.members);
      this.allMembers = members;
    })
  }

  async loadSprints() {
    this.sprintService.getSprints().subscribe(sprints => {
      console.log(sprints);
      console.log(this.projects[0].id);
      this.allSprints = sprints;
      this.sprintsFilteredByProject = this.allSprints.filter(sprint => {
        console.log(sprint.projectId == this.projects[0].id);
        return sprint.projectId == this.projects[0].id;
      });
      this.selectedSprintId = this.sprintsFilteredByProject[0]?.id;
      console.log(this.sprintsFilteredByProject);
    });
  }

  filterByProject(event: Event) {
    console.log(event);
    const selectedElement = event.target as HTMLSelectElement;
    const projectId: number = Number(selectedElement.value);
    this.selectedProjectId = projectId;
    console.log("filterByProject called with projectId: " + projectId);
    console.log(this.sprintsFilteredByProject);
    console.log(this.allSprints);
    this.sprintsFilteredByProject = this.allSprints.filter(sprint => sprint.projectId === projectId);
    console.log(this.sprintsFilteredByProject);
    this.filterBySprint(this.sprintsFilteredByProject[0]?.id.toString());
    console.log(this.allMembers);
    this.members = this.allMembers.filter(member => member.projectId === projectId);
    console.log(this.members);
  }

  filterBySprint(id: string) {
    console.log(id);
    this.selectedSprintId = Number(id);
    console.log("filterBySprint called with sprintId: " + id);
    console.log(this.selectedStories);
    this.selectedStories = this.allStories.filter(story => story.sprintId === this.selectedSprintId);
    this.sprintStories = this.selectedStories;
    console.log("this.selectedStories after filtering by sprintId: ");
    console.log(this.selectedStories);
    if (this.selectedMemberId != 0) {
      this.selectedStories = this.selectedStories.filter(story => story.assignedTo === this.selectedMemberId?.toString());
    }
    if (this.selectedType != 'all') {
      this.selectedStories = this.selectedStories.filter(story => story.itemType === this.selectedType);
    }
    if (this.selectedStatus != 'all') {
      this.selectedStories = this.selectedStories.filter(story => story.status === this.selectedStatus);
    }
    console.log(this.selectedStories);
  }

  filterByAssignee(event: Event) {
    console.log(event);
    const selectedElement = event.target as HTMLSelectElement;
    const memberId: number = Number(selectedElement.value);
    this.selectedMemberId = memberId;
    /* console.log("filterByAssignee called with memberId: " + memberId);
     console.log(this.selectedStories);
     this.selectedStories = this.allStories.filter(story => story.assignedTo == memberId.toString() && story.sprintId === this.selectedSprintId && story.itemType !== 'epic');
       console.log(this.selectedStories);
       //check if member is NaN, then show all stories
       if(memberId.toString() === 'NaN') {
         this.selectedStories = this.allStories;
       }*/
    console.log("this.allStories before filtering: ");
    console.log(this.allStories);
    console.log(this.selectedMemberId);
    this.selectedStories = this.allStories.filter(story => story.sprintId === this.selectedSprintId);
    console.log("this.selectedStories after filtering by sprintId: ");
    console.log(this.selectedStories);
    if (this.selectedMemberId != 0) {
      this.selectedStories = this.selectedStories.filter(story => story.assignedTo === this.selectedMemberId?.toString());
      console.log(this.selectedStories);
    }
    if (this.selectedType != 'all') {
      this.selectedStories = this.selectedStories.filter(story => story.itemType === this.selectedType);
    }
    if (this.selectedStatus != 'all') {
      this.selectedStories = this.selectedStories.filter(story => story.status === this.selectedStatus);
    }
    console.log(this.selectedStories);
  }

  filterByType(event: Event) {
    console.log(event);
    const selectedElement = event.target as HTMLSelectElement;
    const type: string = selectedElement.value;
    this.selectedType = type;
    console.log("filterByType called with type: " + type);
    console.log(this.selectedStories);
    console.log("this.allStories before filtering: ");
    console.log(this.allStories);
    this.selectedStories = this.allStories.filter(story => story.sprintId === this.selectedSprintId);
    console.log("this.selectedStories after filtering by sprintId: ");
    console.log(this.selectedStories);
    if (this.selectedMemberId != 0) {
      this.selectedStories = this.selectedStories.filter(story => story.assignedTo === this.selectedMemberId?.toString());
    }
    if (this.selectedType != 'all') {
      this.selectedStories = this.selectedStories.filter(story => story.itemType === this.selectedType);
    }
    if (this.selectedStatus != 'all') {
      this.selectedStories = this.selectedStories.filter(story => story.status === this.selectedStatus);
    }
    console.log(this.selectedStories);
  }

  filterByStatus(event: Event) {
    console.log(event);
    const selectedElement = event.target as HTMLSelectElement;
    const status: string = selectedElement.value;
    this.selectedStatus = status;
    console.log("filterByStatus called with status: " + status);
    console.log(this.selectedStories);
    console.log("this.allStories before filtering: ");
    console.log(this.allStories);
    this.selectedStories = this.allStories.filter(story => story.sprintId === this.selectedSprintId);
    console.log("this.selectedStories after filtering by sprintId: ");
    console.log(this.selectedStories);
    if (this.selectedMemberId != 0) {
      console.log(this.selectedStories);
      this.selectedStories = this.selectedStories.filter(story => story.assignedTo === this.selectedMemberId?.toString());
      console.log(this.selectedStories);
    }
    if (this.selectedType != 'all') {
      console.log(this.selectedStories);
      this.selectedStories = this.selectedStories.filter(story => story.itemType === this.selectedType);
      console.log(this.selectedStories);
    }
    if (this.selectedStatus != 'all') {
      console.log(this.selectedStories);
      this.selectedStories = this.selectedStories.filter(story => 
        {
          console.log(story.status === this.selectedStatus);
          return story.status === this.selectedStatus;
    });
    }
    console.log(this.selectedStories);
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
    /*this.storyService.getStories().subscribe(stories => {
     console.log(stories);
     this.selectedStories = stories;
     for (let story of this.selectedStories) { 
       console.log(story);
       this.taskService.getTasks().subscribe(tasks => {
         console.log(tasks);
          this.selectedStories = this.selectedStories.map(s => {
           console.log(s.id + " " + story.id);
           if (s.id === story.id) {
             return { ...s, tasks: tasks.filter((t: { storyId: number | null; }) => t.storyId === story.id) };
             
            }
           return s;
       });
       console.log(this.selectedStories);
     });
   }
 
 });*/
    this.loadStoriesAndTasks();
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
    /*this.storyService.getStories().subscribe(stories => {
     console.log(stories);
     this.selectedStories = stories;
     for (let story of this.selectedStories) { 
       console.log(story);
       this.taskService.getTasks().subscribe(tasks => {
         console.log(tasks);
          this.selectedStories = this.selectedStories.map(s => {
           console.log(s.id + " " + story.id);
           if (s.id === story.id) {
             return { ...s, tasks: tasks.filter((t: { storyId: number | null; }) => t.storyId === story.id) };
             
            }
           return s;
       });
       console.log(this.selectedStories);
     });
   }
 
 });*/
    this.loadStoriesAndTasks();
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
    this.listViewClicked = true;
    this.projectBoardClicked = false;
    this.showMenu = false;
    this.boardViewClicked = false;
    this.profileClicked = false;
  }

  openProjectBoard() {
    this.projectBoardClicked = true;
    this.listViewClicked = false;
    this.showMenu = false;
    this.boardViewClicked = false;
    this.profileClicked = false;
  }

  openViewBoard() {
    this.projectBoardClicked = false;
    this.listViewClicked = false;
    this.showMenu = false;
    this.boardViewClicked = true;
    this.profileClicked = false;
  }

  openProfile() {
    this.projectBoardClicked = false;
    this.listViewClicked = false;
    this.showMenu = false;
    this.boardViewClicked = false;
    this.profileClicked = true;
  }

  openUser() {
    this.projectBoardClicked = false;
    this.listViewClicked = false;
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
