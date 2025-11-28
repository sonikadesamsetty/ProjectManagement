import { NgFor } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../models/task';
import { TaskService } from '../task.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../project.service';
import { SprintService } from '../sprint.service';
import { Sprint } from '../models/sprint';
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [NgFor, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {


  @Input() taskId: number | 0 = 0;
  @Output() taskClicked = new EventEmitter<boolean>();

  @Input() storyId: number | 0 = 0;

  @Input() projectId!: number;

  taskService = inject(TaskService);
  projectService = inject(ProjectService);
  sprintService = inject(SprintService);
  allSprints!: Sprint[];
  filteredSprints!: Sprint[];
  members: any = [];
  sprintName!: string;
  assignee!: any;
  constructor() { }
  task!: Task | undefined;


  comments = [
    { id: 1, text: 'This is the first comment.' },
    { id: 2, text: 'This is the second comment.' },
    { id: 3, text: 'This is the third comment.' }
  ];


  taskForm = new FormGroup({
    "title": new FormControl(),
    "description": new FormControl(),
    "status": new FormControl(),
    "assignedTo": new FormControl(),
    "discussion": new FormControl(),
    "priority": new FormControl(),
    "sprint": new FormControl(),
    "totalHours": new FormControl(),
    "remainingHours": new FormControl(),
    "completedHours": new FormControl()
  });

  ngOnInit(): void {
    console.log("ngOnInit called");

    
    console.log("Task ID: ", this.taskId);
    this.taskService.getTask(this.taskId).subscribe((task) => {
      this.task = task;

      this.sprintService.getSprints().subscribe(sprints => {
      this.allSprints = sprints;

      this.filteredSprints = sprints.filter(sprint => sprint.projectId == this.projectId);
      console.log("Filtered Sprints: ", this.filteredSprints);
    });

    this.projectService.getProjectMembers().subscribe(members => {
      members.forEach(member => {
        if (member.projectId == this.projectId) {
          this.members.push(member);

        }
      });
            this.assignee = this.members.find((member: { id: number; }) => member.id == Number(this.task?.assignedTo))?.name || '';

      console.log("Project Members: ", this.members);
    });


      console.log("Assigned To Name: ", this.assignee);
      console.log("Sprint Name: ", this.sprintName);
      console.log(this.task);
      if (this.task) {
        this.taskForm.patchValue({
          title: this.task.title,
          description: this.task.description,
          status: this.task.status,
          assignedTo: this.task.assignedTo,
          discussion: this.task.discussion,
          priority: this.task.priority,
          sprint: this.task.sprintId,
          totalHours: this.task.totalHours,
          remainingHours: this.task.remainingHours,
          completedHours: this.task.completedHours
        });
      }



    }
    );
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log("ngOnChanges called");

  }

  saveChanges() {
    if (this.taskId == 0) {
      //create a new task
      console.log("Creating new task");
      console.log(this.storyId);
      const newTask = new Task(0, this.taskForm.value.title || '', this.taskForm.value.description || '', this.taskForm.value.status || '', this.taskForm.value.assignedTo || '', this.taskForm.value.discussion || '', this.taskForm.value.priority || '', this.storyId || 0, this.taskForm.value.totalHours || 0, this.taskForm.value.remainingHours || 0, this.taskForm.value.completedHours || 0, this.taskForm.value.sprint || 0);
      console.log("Creating new task:", newTask);
      const response = this.taskService.addTask(newTask)
      console.log(response);
      this.taskClicked.emit(false);
    } else if (this.taskId > 0) {
      //update existing task
      console.log("Updating existing task");
      console.log(this.taskForm.value);
      const updatedTask = new Task(this.taskId || 0, this.taskForm.value.title || this.task?.title, this.taskForm.value.description || this.task?.description, this.taskForm.value.status || this.task?.status, this.taskForm.value.assignedTo || this.task?.assignedTo, this.taskForm.value.discussion || this.task?.discussion, this.taskForm.value.priority || this.task?.priority, this.storyId || 0, this.taskForm.value.totalHours || this.task?.totalHours, this.taskForm.value.remainingHours || this.task?.remainingHours, this.taskForm.value.completedHours || this.task?.completedHours, 1);
      console.log("Updating task:", updatedTask);
      this.taskService.updateTask(updatedTask).subscribe((res) => {
        console.log(res);
        this.taskClicked.emit(false);
      }
      );

    }
  }

  deleteItem() {
    console.log("deleteItem called");
    this.taskService.deleteTask(this.taskId).subscribe(() => {
      console.log("Task deleted");
      this.taskClicked.emit(false);
    });
  }

  close() {
    console.log("close called");
    this.taskClicked.emit(false);
  }

}
