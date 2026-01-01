import { Component, inject, OnInit } from '@angular/core';
import { Member } from '../models/members';
import { Project } from '../models/project';
import { Sprint } from '../models/sprint';
import { Story } from '../models/story';
import { Task } from '../models/task';
import { ProjectService } from '../project.service';
import { StoryService } from '../story.service';
import { TaskService } from '../task.service';
import { SprintService } from '../sprint.service';
import { CardComponent } from '../card/card.component';
import { Router } from '@angular/router';
import {UserService} from '../user.service';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop'; import { CommonModule, NgFor } from '@angular/common';
@Component({
  selector: 'app-kanban-view',
  standalone: true,
  imports: [CardComponent, NgFor, CommonModule, DragDropModule],
  templateUrl: './kanban-view.component.html',
  styleUrl: './kanban-view.component.css'
})
export class KanbanViewComponent {

  states = ['New', 'Grooming', 'Active', 'Development', 'ReadyForReview', 'ReadyForTesting', 'Closed'];
  newState!: string;

  storyService = inject(StoryService);
  taskService = inject(TaskService);
  projectService = inject(ProjectService);
  sprintService = inject(SprintService);
  userService = inject(UserService);
  router = inject(Router);
  projects: Project[] = [];
  allProjects: Project[] = [];

  stories: Story[] = [];
  allStories: Story[] = [];
  sprints: Sprint[] = [];
  allSprints: Sprint[] = [];
  tasks: Task[] = [];
  members: Member[] = [];
  allMembers: Member[] = [];
  selectedProjectId!: number;
  selectedSprintId!: number;
  selectedAssigneeId!: number;
  userEmail = '';
  selectedStories!: Story[];
  sprintStories!: Story[];
  selectedMemberId=0;
  sprintsFilteredByProject!: Sprint[];
  ngOnInit(): void {
     this.userEmail = localStorage.getItem("user") || '';
     console.log(this.userEmail);
        if(!this.userEmail) { 
          console.log("No logged in user found");
          this.router.navigateByUrl("/signin");
        }
    //this.loadProjects();
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
    console.log(this.selectedStories);
  }

  /*async loadProjects() {
    await this.projectService.getProjects().subscribe(projects => {
      this.allProjects = projects;
      this.projects = projects;
      console.log(this.projects);
      this.selectedProjectId = this.projects[0]?.id;



      this.sprintService.getSprints().subscribe(sprints => {
        console.log(sprints);
        this.sprints = sprints;
        this.allSprints = sprints;
        this.selectedSprintId = this.sprints[0]?.id;
        this.storyService.getStories().subscribe(stories => {
          console.log(stories);
          this.stories = stories;
          this.allStories = stories;
          for (let story of this.stories) {
            console.log(story);

          }
        });

        this.projectService.getProjectMembers().subscribe(members => {
          console.log(members);
          this.allMembers = members;
          this.members = members.filter(member => member.projectId === this.selectedProjectId);
        });
      });

      


    });
  }*/

  getStoriesByState(state: string) {
    return this.selectedStories.filter((s) => s.status === state);
  }

  // Connect all drop lists dynamically
  get connectedDropLists(): string[] {
    return this.states.map((state) => state);
  }

  // Handle drop
  onDrop(event: CdkDragDrop<any[]>, newState: string) {
    console.log("newstate::",newState);
    this.newState = newState;
    const story = event.item.data;
    console.log("story::", story);
    if (story.status !== newState) {
      story.status = newState;
      console.log(`Moved "${story.title}" to ${newState}`);
    }

    // ensure reordering works between lists
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.storyService.updateStoryState(story.id,this.newState).subscribe(res=>{
      console.log(res);
      
    });
  }

  searchItems(event: any) {
    this.selectedStories = this.allStories.filter(story => story.title.includes(event.target.value));
  }

  /*filterByProject(event: Event) {
    console.log(event);
    const selectedElement = event.target as HTMLSelectElement;
    this.selectedProjectId = Number(selectedElement.value);

    console.log("updateSprints called with projectId: " + this.selectedProjectId);
    console.log(this.sprints);
    this.sprints = this.allSprints.filter(sprint => sprint.projectId === this.selectedProjectId);
    console.log(this.sprints);
    console.log(this.allMembers);
    this.members = this.allMembers.filter(member => member.projectId === this.selectedProjectId);
    console.log(this.members);
  }

  filterBySprint(event: Event) {
    console.log(event);
    const selectedElement = event.target as HTMLSelectElement;
    this.selectedSprintId = Number(selectedElement.value);
    console.log("updateStories called with sprintId: " + this.selectedSprintId);
    console.log(this.stories);
    console.log(this.selectedProjectId);
    this.stories = this.allStories.filter(story => story.sprintId === this.selectedSprintId && this.selectedAssigneeId ? (Number(story.assignedTo) == this.selectedAssigneeId) : true);
    console.log(this.stories);
  }

  filterByAssignee(event: Event) {
    console.log(event);
    const selectedElement = event.target as HTMLSelectElement;
    this.selectedAssigneeId = Number(selectedElement.value);
    console.log("filterByAssignee called with memberId: " + this.selectedAssigneeId);
    console.log(this.stories);
    this.stories = this.allStories.filter(story => story.assignedTo === selectedElement.options[selectedElement.selectedIndex].text && (this.selectedSprintId ? story.sprintId === this.selectedSprintId : true));
    console.log(this.stories);
  }*/
}