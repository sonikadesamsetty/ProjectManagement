import { Component, EventEmitter, inject, NgModule, OnInit, Output, ViewChild } from '@angular/core';
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
import { Router } from '@angular/router';
import { SprintComponent } from '../sprint/sprint.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [DatePipe, MatIcon, ReactiveFormsModule, NgFor, NgIf, SprintComponent],
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
  isSprintModalOpen: boolean = false;
  editMode: boolean = false;

  sprintForm!: FormGroup;
  manageSprintForm!: FormGroup;
  sprintService = inject(SprintService);
  userEmail!: string
  manageSprintModal: boolean = false;
  sprints!: Sprint[];
  projectSprints!: Sprint[];
  addedMembers: Member[] = [];
  removedMembers: Member[] = [];
  projectMembers: Member[] = [];
  router = inject(Router);

  @ViewChild('memberInput') memberInput: any;
  memberErrorMsg!: string;
  ngOnInit(): void {

    this.userEmail = localStorage.getItem("user") || '';
    console.log(this.userEmail);
    if(!this.userEmail) { 
      console.log("No logged in user found");
      this.router.navigateByUrl("/user");
    }
    this.userService.getAllUsers().subscribe(res => {
      this.users = res;
      console.log(res);
    });
    this.getAllProjects();

   
   /* this.projectService.getProjectMembers().subscribe((members) => {
      this.allMembers = members;
      //this.members = members;
      console.log(this.allMembers);
    });

    this.sprintService.getSprints().subscribe(sprints=>
      {
        this.sprints = sprints;
        console.log(this.sprints);
  });*/

    this.projectForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      startDate: new FormControl('',Validators.required),
      endDate: new FormControl('', Validators.required),
      members: new FormControl('')
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
    })
  }

  getAllProjects() {
     this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.allProjects = projects;
      console.log(this.projects);

    });
  }

  async editProject(project?: Project) {
     this.projectForm.patchValue({
    name: project?.name,
    description: project?.description,
    startDate: project?.startDate,
    endDate: project?.endDate,
    modifiedBy: this.userEmail
  });
  this.projectMembers = project?.projectMembers || [];
    console.log('Editing project:', project);
    /*const selectedEmails = project?.projectMembers.map(m => m.name);
    const checkboxControls = this.users.map(user =>
      new FormControl(selectedEmails?.includes(user.email))
    );

    this.projectForm = new FormGroup({
      name: new FormControl(project?.name),
      members: new FormArray(checkboxControls),
      description: new FormControl(project?.description),
      startDate: new FormControl(project?.startDate),
      endDate: new FormControl(project?.endDate),
    });*/
    // Implement your edit logic here

    this.selectedProject = await project || null;
    console.log(this.selectedProject);

    this.openEditModal = true;

  }

  createOrEditProject() {
    console.log('Form submitted');
    this.openEditModal = false;
    // Implement your form submission logic here
    console.log(this.projectForm.value);
    /*const projectData = this.projectForm.value;
    console.log(projectData);*/
    if (this.selectedProject) {
      /*const members: Member[] = this.allMembers.filter(member => projectData.members?.filter((m: any) =>
        m == member.id
      ));*/
      if(this.addedMembers.length>=0) {
        this.addedMembers.forEach(m=>this.projectService.addProjectMembers(m).subscribe(res=>
        {
          console.log("Added member: ", res);
      }));
    } if(this.removedMembers.length>0) {
      this.removedMembers.forEach(m=>{
      this.projectService.removeProjectMembers(m.id).subscribe(res=>
        {
          console.log("Removed members: ", res);
      });
    });
    }
    const updatedFields = this.getDirtyValues(this.projectForm);
     /* const updatedProject = new Project(this.selectedProject.id, projectData.name || this.selectedProject.name, projectData.description || this.selectedProject.description, projectData.startDate ? new Date(projectData.startDate) : this.selectedProject.startDate, projectData.endDate ? new Date(projectData.endDate) : this.selectedProject.endDate, this.selectedProject.createdBy, 'Admin', this.selectedProject.createdAt, new Date(), this.members || this.selectedProject.projectMembers);
      console.log(updatedProject);*/
      console.log("updated fields: ", updatedFields);
      if(updatedFields.startDate) {
        updatedFields.startDate = new Date(updatedFields.startDate);
      }
      if(updatedFields.endDate) {
        updatedFields.endDate = new Date(updatedFields.endDate);
      }
      this.projectService.updateProject(this.selectedProject.id,updatedFields).subscribe((project) => {
        console.log('Project updated:', project);
        this.getAllProjects();

       /* const index = this.projects.findIndex(p => p.id === project.id);
        if (index !== -1) {
          this.projects[index] = project;
        }
        this.projectForm.reset();
        this.selectedProject = null;
        this.projectService.getProjectMembers().subscribe((members) => {
          this.allMembers = members;
          this.members = [];
          console.log(this.allMembers);
        });*/
        this.addedMembers = [];
        this.removedMembers = [];
        this.projectForm.reset();
        this.selectedProject = null;
      });

    } else {

      const newProject = new Project(0, this.projectForm.value.name || '', this.projectForm.value.description || '', this.projectForm.value.startDate ? new Date(this.projectForm.value.startDate) : new Date(), this.projectForm.value.endDate ? new Date(this.projectForm.value.endDate) : new Date(), this.userEmail, this.userEmail, new Date(), new Date(), this.addedMembers || []);
      console.log("new project");
      console.log(newProject);
      this.projectService.addProject(newProject).subscribe((project) => {
        console.log('Project added:', project);
        //this.projects.push(project);
        this.projectForm.reset();
        this.selectedProject = null;
        this.getAllProjects();
        this.addedMembers = [];
        this.removedMembers = [];
        /*this.projectService.getProjectMembers().subscribe((members) => {
          this.allMembers = members;
          this.members = [];
          console.log(this.allMembers);
        });*/
      });
    }
  }

  getDirtyValues(form: FormGroup): any {
  const dirty: any = {};

  Object.keys(form.controls).forEach(key => {
    const control = form.get(key);

    if (control instanceof FormControl && control.dirty) {
      dirty[key] = control.value;
    }

    if (control instanceof FormArray && control.dirty) {
      dirty[key] = control.value;
    }

    if (control instanceof FormGroup && control.dirty) {
      dirty[key] = this.getDirtyValues(control);
    }
  });

  return dirty;
}

  deleteProject() {
    this.openDeleteModal = false;
    console.log('Project deleted');
    this.projectService.deleteProject(this.selectedProject).subscribe((projects) => {
      console.log(this.projects);
      this.getAllProjects();
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

  /*isSelected(user: User) {
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
  }*/

 /* toggleCheckboxList() {
    this.showCheckboxes = !this.showCheckboxes;
  }*/

  /*onCheckboxChange(event: Event, index: number) {
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
  }*/



  hideSprintModal() {
    this.isSprintModalOpen = false;
  }

  manageSprint() {
   this.isSprintModalOpen = true;
    this.editMode = true;
  }

  createSprint() {
    this.isSprintModalOpen=true;
    this.editMode = false;
  }
  
  onSprintSubmit() {
    const sprint = new Sprint(0,this.sprintForm.value.name,new Date(this.sprintForm.value.startDate),new Date(this.sprintForm.value.endDate),this.userEmail,this.userEmail,new Date(), new Date(),this.sprintForm.value.projectId);
    this.sprintService.createSprint(sprint).subscribe(res=>
      {
        console.log(res);
        this.isSprintModalOpen = false;
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

  addProjectMember(memberEmail: string) {
    this.memberErrorMsg = "";
    const member: any = this.projectMembers.find(u => u.name.toLowerCase() === memberEmail.toLowerCase());
    if (!member) {
      console.log(this.users);
      console.log(memberEmail);
      const user = this.users.find(u => u.email.toLowerCase() === memberEmail.toLowerCase());
      if(!user) {
        console.log("User not found");
        this.memberErrorMsg = "Invalid user";
        return;
      }
      this.addedMembers.push({
        id: 0,
        name: user.email,
        createdAt: new Date(),
        projectId: this.selectedProject?.id ?? 0,
        role: 'Dev'
      });
      console.log("Added member: ", this.members);
    } else {
      console.log("Member already added to this project");
      this.memberErrorMsg = "Member already part of the project";
      return;
    }
    this.memberInput.nativeElement.value = '';
    
  }

  removeProjectMember(member: Member) {
    const addedIndex = this.addedMembers.findIndex(m => m.name === member.name);
    if (addedIndex !== -1) {
      this.addedMembers.splice(addedIndex, 1);
      console.log("Removed from added members: ", this.addedMembers);
      return;
    } else {
      const projectIndex = this.projectMembers.findIndex(m => m.name === member.name);
      
      if (projectIndex !== -1) {
        this.removedMembers.push(member);
      }
      this.projectMembers = this.projectMembers.filter(m => m.name !== member.name);
    
    console.log("Marked for removal: ", this.removedMembers);
  }

}

closeSprintModal() {
    this.isSprintModalOpen = false;
    this.sprintForm.reset();
}

closeProjectModal() {
    this.openEditModal = false;
    this.projectForm.reset();
    this.selectedProject = null;
    this.addedMembers = [];
    this.removedMembers = [];
    this.memberErrorMsg = "";
    this.memberInput.nativeElement.value = '';
}

closeManageSprintModal() {
    this.manageSprintModal = false;
    this.manageSprintForm.reset();
}
}
