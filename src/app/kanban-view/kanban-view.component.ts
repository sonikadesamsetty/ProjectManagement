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
  ngOnInit(): void {
    this.loadProjects();

  }

  async loadProjects() {
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
  }

  getStoriesByState(state: string) {
    return this.stories.filter((s) => s.status === state);
  }

  // Connect all drop lists dynamically
  get connectedDropLists(): string[] {
    return this.states.map((state) => state);
  }

  // Handle drop
  onDrop(event: CdkDragDrop<any[]>, newState: string) {
    this.newState = newState;
    const story = event.item.data;
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
  }

  searchItems(event: any) {
    this.stories = this.allStories.filter(story => story.title.includes(event.target.value));
  }

  filterByProject(event: Event) {
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
  }
}