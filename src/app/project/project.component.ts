import { Component, inject, NgModule, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { Project } from '../models/project';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Member } from '../models/members';
import { FormArray, FormControl, FormGroup, FormGroupDirective, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { SprintService } from '../sprint.service';
import { Sprint } from '../models/sprint';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [DatePipe, MatIcon, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {

  allProjects: Project[] = [];
  projects: Project[] = [];

  members: Member[] = [];
  allMembers: Member[] = [];
  searchTerm: string = '';
  openEditModal: boolean = false;
  projectService = inject(ProjectService);
  openDeleteModal: boolean = false;
  selectedProject: Project | null = null;
  projectForm!: FormGroup;
  users!: User[];
  userService = inject(UserService);
  showCheckboxes: boolean = false;
  selectedMembers!: Member[];
  openSprintModal: boolean = false;
  sprintForm!: FormGroup;
  manageSprintForm!: FormGroup;
  sprintService = inject(SprintService);
  userEmail!: string
  manageSprintModal: boolean = false;
  sprints!: Sprint[];
  projectSprints!: Sprint[];
  ngOnInit(): void {

    this.userEmail = this.userService.getLoggedInUser();
    console.log(this.userEmail);
    this.userService.getAllUsers().subscribe(res => {
      this.users = res;
      console.log(res);
      this.projectForm.setControl(
        'members',
        new FormArray(this.users.map(() => new FormControl(false)))
      );
    })

    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.allProjects = projects;
      console.log(this.projects);

    });
    this.projectService.getProjectMembers().subscribe((members) => {
      this.allMembers = members;
      //this.members = members;
      console.log(this.allMembers);
    });

    this.sprintService.getSprints().subscribe(sprints=>
      {
        this.sprints = sprints;
        console.log(this.sprints);
  });

    this.projectForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      members: new FormArray([])  // empty initially
    });

    this.sprintForm = new FormGroup({
      name: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      projectId: new FormControl('')
    });

    this.manageSprintForm = new FormGroup({
      sprintId: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      projectId: new FormControl('')
    })
  }

  async editProject(project?: Project) {
    console.log('Editing project:', project);
    const selectedEmails = project?.projectMembers.map(m => m.name);
    const checkboxControls = this.users.map(user =>
      new FormControl(selectedEmails?.includes(user.email))
    );

    this.projectForm = new FormGroup({
      name: new FormControl(project?.name),
      members: new FormArray(checkboxControls),
      description: new FormControl(project?.description),
      startDate: new FormControl(project?.startDate),
      endDate: new FormControl(project?.endDate),
    });
    // Implement your edit logic here

    this.selectedProject = await project || null;
    console.log(this.selectedProject);

    this.openEditModal = true;

  }

  onSubmit() {
    console.log('Form submitted');
    this.openEditModal = false;
    // Implement your form submission logic here
    console.log(this.projectForm.value);
    const projectData = this.projectForm.value;
    console.log(projectData);
    if (this.selectedProject) {
      const members: Member[] = this.allMembers.filter(member => projectData.members?.filter((m: any) =>
        m == member.id
      ));
      const updatedProject = new Project(this.selectedProject.id, projectData.name || this.selectedProject.name, projectData.description || this.selectedProject.description, projectData.startDate ? new Date(projectData.startDate) : this.selectedProject.startDate, projectData.endDate ? new Date(projectData.endDate) : this.selectedProject.endDate, this.selectedProject.createdBy, 'Admin', this.selectedProject.createdAt, new Date(), this.members || this.selectedProject.projectMembers);
      console.log(updatedProject);
      this.projectService.updateProject(updatedProject).subscribe((project) => {
        console.log('Project updated:', project);
        const index = this.projects.findIndex(p => p.id === project.id);
        if (index !== -1) {
          this.projects[index] = project;
        }
        this.projectForm.reset();
        this.selectedProject = null;
        this.projectService.getProjectMembers().subscribe((members) => {
          this.allMembers = members;
          this.members = [];
          console.log(this.allMembers);
        });
      });

    } else {

      const newProject = new Project(0, this.projectForm.value.name || '', this.projectForm.value.description || '', this.projectForm.value.startDate ? new Date(this.projectForm.value.startDate) : new Date(), this.projectForm.value.endDate ? new Date(this.projectForm.value.endDate) : new Date(), this.userEmail, this.userEmail, new Date(), new Date(), this.members || []);
      console.log("new project");
      console.log(newProject);
      this.projectService.addProject(newProject).subscribe((project) => {
        console.log('Project added:', project);
        this.projects.push(project);
        this.projectForm.reset();
        this.selectedProject = null;
        this.projectService.getProjectMembers().subscribe((members) => {
          this.allMembers = members;
          this.members = [];
          console.log(this.allMembers);
        });
      });
    }
  }

  deleteProject() {
    this.openDeleteModal = false;
    // Implement your delete logic here
    console.log('Project deleted');
    this.projectService.deleteProject(this.selectedProject).subscribe((projects) => {
      console.log(this.projects);
    });
  }

  openDeleteModall(project: any) {
    this.openDeleteModal = true;
    console.log('Opening delete modal for project:', project);
    this.selectedProject = project;
  }

  searchProjects(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    console.log('Searching projects for term:', this.searchTerm);

    this.projects = this.allProjects.filter(project => project.name.toLowerCase().includes(this.searchTerm));
    console.log(this.projects);

  }

  isSelected(user: User) {
    console.log(user);
    console.log(this.members);
    const resVal = this.members.filter((pm: { name: string; }) => {
      console.log(pm.name + " " + user.email);
      console.log(pm.name == user.email);
      console.log(pm.name === user.email);
      return pm.name === user.email;
    })?.length;
    console.log(resVal);
    return resVal ? resVal > 0 ? true : false : false
  }

  toggleCheckboxList() {
    this.showCheckboxes = !this.showCheckboxes;
  }

  onCheckboxChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;
    const user = this.users[index];

    if (checked) {
      this.members.push({
        id: 0,
        name: user.email,
        createdAt: new Date(),
        projectId: this.selectedProject?.id ?? 0,
        role: 'Dev'
      });
      console.log("checked: ", this.members);
    } else {
      const existingMem = this.selectedProject?.projectMembers?.find(pm => pm.name === user.email);
      existingMem ? this.members.push(existingMem) : 0;
      console.log("unchecked:", this.members);
    }
  }

  createSprint() {
    this.openSprintModal = true;
  }

  hideSprintModal() {
    this.openSprintModal = false;
  }

  manageSprint() {
    this.manageSprintModal = true;
  }
  
  onSprintSubmit() {
    const sprint = new Sprint(0,this.sprintForm.value.name,new Date(this.sprintForm.value.startDate),new Date(this.sprintForm.value.endDate),this.userEmail,this.userEmail,new Date(), new Date(),this.sprintForm.value.projectId);
    this.sprintService.createSprint(sprint).subscribe(res=>
      {
        console.log(res);
        this.openSprintModal = false;
        this.sprintForm.reset();
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

 
}
