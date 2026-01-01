import { Component, EventEmitter, inject, Input, OnInit, Output, output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Sprint } from '../models/sprint';
import { SprintService } from '../sprint.service';
import { UserService } from '../user.service';
import { Project } from '../models/project';
import { ProjectService } from '../project.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sprint',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './sprint.component.html',
  styleUrl: './sprint.component.css'
})
export class SprintComponent implements OnInit {
  sprintForm!: FormGroup;
  manageSprintForm!: FormGroup;
  sprintService = inject(SprintService);
  manageSprintModal: boolean = false;
  sprints!: Sprint[];
  projectSprints!: Sprint[];
  isSprintModalOpen!: boolean;
  userEmail: any;
  userService = inject(UserService);
  users: any;
  projectService = inject(ProjectService);
  projects: Project[] = [];
  allProjects: Project[] = [];

  @Output()
  closeModal = new EventEmitter<boolean>();

  @Input()
  openModal!: boolean;

  @Input()
  isEditMode!: boolean;

  ngOnInit(): void {
    this.userEmail = localStorage.getItem("user") || '';
    console.log(this.userEmail);
    this.userService.getAllUsers().subscribe(res => {
      this.users = res;
      console.log(res);
    });

    this.sprintForm = new FormGroup({
      name: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      projectId: new FormControl('', Validators.required)
    });

    this.manageSprintForm = new FormGroup({
      sprintId: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      projectId: new FormControl('', Validators.required)
    });

    this.sprintService.getSprints().subscribe(sprints => {
      this.sprints = sprints;
      console.log(this.sprints);
    });
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.allProjects = projects;
      console.log(this.projects);

    });
  }

  hideSprintModal() {
    this.closeModal.emit(false);
  }

  manageSprint() {
    this.sprintService.getSprints().subscribe(sprints => {
      this.sprints = sprints;
      console.log(this.sprints);
    });
    this.manageSprintModal = true;

  }

  /* onSprintSubmit() {
     const sprint = new Sprint(0,this.sprintForm.value.name,new Date(this.sprintForm.value.startDate),new Date(this.sprintForm.value.endDate),this.userEmail,this.userEmail,new Date(), new Date(),this.sprintForm.value.projectId);
     this.sprintService.createSprint(sprint).subscribe(res=>
       {
         console.log(res);
         this.isSprintModalOpen = false;
         this.sprintForm.reset();
   });
   }*/

  onSprintSubmit() {
    const sprint = new Sprint(0,this.sprintForm.value.name,new Date(this.sprintForm.value.startDate),new Date(this.sprintForm.value.endDate),this.userEmail,this.userEmail,new Date(), new Date(),this.sprintForm.value.projectId);
    this.sprintService.createSprint(sprint).subscribe(res=>
      {
        console.log(res);
        this.isSprintModalOpen = false;
        this.sprintForm.reset();
        this.closeModal.emit(false);
  });
  }

  onManageSprintSubmit() {
    const createdBy = this.projectSprints.find(sprint=>sprint.id==this.manageSprintForm.value.sprintId)?.createdBy;
    const sprint = new Sprint(this.manageSprintForm.value.sprintId,this.manageSprintForm.value.name,new Date(this.manageSprintForm.value.startDate),new Date(this.manageSprintForm.value.endDate),createdBy||"",this.userEmail,new Date(), new Date(),this.manageSprintForm.value.projectId);
    this.sprintService.updateSprint(sprint).subscribe(res=>
      {
        console.log(res);
        this.manageSprintModal = false;
        this.manageSprintForm.reset();
        this.closeModal.emit(false);
  });
  }
  filterSprints() {
      console.log(this.manageSprintForm.value.projectId);
      this.projectSprints = this.sprints.filter(sprint=>
        {
          console.log(sprint.projectId +  " " + this.manageSprintForm.value.projectId);
          return sprint.projectId==this.manageSprintForm.value.projectId;
    });
      console.log(this.projectSprints);
    }
  
    deleteSprint() {
      this.sprintService.deleteSprint(this.manageSprintForm.value.sprintId).subscribe(res=>
        {
          this.manageSprintModal = false;
          console.log(res);
          this.manageSprintForm.reset();
    });
    }
  
  closeSprintModal() {
      this.isSprintModalOpen = false;
      this.sprintForm.reset();
      this.closeModal.emit(false);
  }
  
  
  closeManageSprintModal() {
      this.manageSprintModal = false;
      this.manageSprintForm.reset();
      this.closeModal.emit(false);
  }
}