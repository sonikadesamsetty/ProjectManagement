import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StoryService } from '../story.service';
import { Story } from '../models/story';
import { MatIconModule } from '@angular/material/icon';
import { SprintService } from '../sprint.service';
import { Sprint } from '../models/sprint';
import { Member } from '../models/members';
import { ProjectService } from '../project.service';
import { UserService } from '../user.service';
import { Attachment } from '../models/attachment';
import { ElementRef, ViewChild } from '@angular/core';
import { AttachmentService } from '../attachment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './story.component.html',
  styleUrl: './story.component.css'
})
export class StoryComponent implements OnInit, OnChanges {
  allSprints!: Sprint[];
  filteredSprints!: Sprint[];
  existingSprintName!: string;
  existingAssignedToName!: string;

  //get the story id from board component while redirecting to this component
  //use ActivatedRoute to get the id from the route parameters
  //fetch the story details using the id and display it in the template
  constructor() { }
  //create an interface for story

  storyService = inject(StoryService);
  sprintService = inject(SprintService);
  attachmentService = inject(AttachmentService);

  stories: Story[] = [];

  story: Story | undefined;

  @Input() storyId: number | 0 = 0;

  @Output() storyClicked = new EventEmitter<boolean>(true);

  @Input() itemType: string | undefined;

  @Input() projectId!: number;

  members: Member[] = [];

  projectService = inject(ProjectService);
  userService = inject(UserService);
  userEmail!: string;

  states = ['New', 'Grooming', 'Active', 'Development', 'ReadyForReview', 'ReadyForTesting', 'Closed'];

  selectedFile: File[] = [];

  removedFiles: number[] = [];

  addedFiles: File[] = [];

  attachments: Attachment[] = [];

  router = inject(Router);

  @ViewChild('fileInput') fileInput!: ElementRef;




  storyForm = new FormGroup({
    // Define your form controls here
    "title": new FormControl(),
    "description": new FormControl(),
    "status": new FormControl(),
    "assignedTo": new FormControl(),
    "discussion": new FormControl(),
    "priority": new FormControl(),
    "capacity": new FormControl(),
    "dor": new FormControl(),
    "acceptanceCriteria": new FormControl(),
    "sprintId": new FormControl()


  });

  subscriptions: any[] = [];

  ngOnInit(): void {
    console.log("ngOnInit called");
    this.userEmail = this.userService.getLoggedInUser();
    if(!this.userEmail) { 
      console.log("No logged in user found");
      this.router.navigateByUrl("/user");
    }
    console.log(this.userEmail);
    console.log("Project ID: ", this.projectId);

    this.storyService.getAllSubscriptions().subscribe((subscriptions) => {
      this.subscriptions = subscriptions;
      console.log("All Subscriptions: ", this.subscriptions);
    });

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
      this.storyService.getStories().subscribe(stories => {
        this.stories = stories;
        if (this.storyId > 0) {
          console.log(this.storyId);
          this.storyService.getStoryById(this.storyId).subscribe(storyData => {
            this.story = storyData;
            console.log("Fetched Story: ", this.story);
            console.log(this.story);
            console.log(this.members);
            const assignedTo = this.members.find(member => member.id == Number(this.story?.assignedTo))?.name || '';
            const sprintName = this.allSprints.find(sprint => sprint.id == this.story?.sprintId)?.name || '';
            this.existingSprintName = sprintName;
            this.existingAssignedToName = assignedTo;
            this.story.attachments.forEach(attachmentData => {
              const attachment = new Attachment(attachmentData.id, attachmentData.fileName, attachmentData.fileSize,attachmentData.fileType, attachmentData.fileData);
              this.attachments.push(attachment);
            });
            console.log("Attachments: ", this.attachments);
            //convert the attachment fileData (base64) to File object and push to selectedFile array
            /*this.attachments.forEach(attachmentData => {
               const file = new File(
                [this.base64ToBlob(attachmentData.fileData, attachmentData.fileType)],
                attachmentData.fileName,
                { type: attachmentData.fileType }
              );
              this.selectedFile.push(file);
            });*/
            //this.story = this.stories.find((s: { id: number | null; }) => s.id === this.storyId) ?? undefined;

        });
      }
    });
      console.log("Project Members: ", this.members);
    });



  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("projectId in ngOnChanges: ", this.projectId);
    console.log("ngOnChanges called");
    if (changes['storyId'] && this.storyId) {
      this.story = this.stories.find((s: { id: number | null; }) => s.id === this.storyId);
    }
  }



  close() {
    console.log("close called");
    console.log("emitting false");
    this.storyClicked.emit(false);
  }

  async saveChanges() {

    console.log("saveChanges called");

    console.log(this.storyForm.value);
    if (this.storyId == 0) {
      //create a new story
      const newStory = new Story(0, this.storyForm.value.title || '', this.storyForm.value.description || '', this.storyForm.value.status || '', this.storyForm.value.assignedTo || '', this.storyForm.value.discussion || '', this.storyForm.value.priority || '', this.storyForm.value.capacity || 0, this.storyForm.value.dor || '', this.storyForm.value.acceptanceCriteria || '', this.storyForm.value.sprintId, this.itemType || 'story');
      newStory.createdBy = this.userEmail;

      console.log("Creating new story:", newStory);
      console.log(this.addedFiles);

      const storyCreated = {
        ...newStory
      }
      const formData = new FormData();

      // Add story JSON
      formData.append(
        'story',
        new Blob([JSON.stringify(newStory)], { type: 'application/json' })
      );

      // Add attachments
      for (let file of this.addedFiles) {
        formData.append('attachments', file);
      }
      const response = await this.storyService.addStory(formData);
      console.log("story created: ", response);
      this.storyClicked.emit(false);
      this.addedFiles = [];
      this.removedFiles=[];
    } else {
      //update the existing story        
      const updatedStory = new Story(this.storyId || 0, this.storyForm.value.title || this.story?.title, this.storyForm.value.description || this.story?.description, this.storyForm.value.status || this.story?.status, this.storyForm.value.assignedTo || this.story?.assignedTo, this.storyForm.value.discussion || this.story?.discussion, this.storyForm.value.priority || this.story?.priority, this.storyForm.value.capacity || this.story?.capacity, this.storyForm.value.dor || this.story?.dor, this.storyForm.value.acceptanceCriteria || this.story?.acceptanceCriteria, this.storyForm.value.sprintId || this.story?.sprintId, this.itemType || this.story?.itemType || 'story');
      updatedStory.createdBy = this.userEmail;
      console.log("Updating story:", updatedStory);
      
     
      this.storyService.updateStory(updatedStory);
      if(this.addedFiles.length > 0){
        this.attachmentService.uploadAttachments(this.storyId, this.addedFiles).subscribe((res: any) => {
          console.log("Attachments uploaded: ", res);
        });
      } 
      if(this.removedFiles.length > 0){
        this.attachmentService.deleteAttachments(this.storyId, this.removedFiles).subscribe((res: any) => {
          console.log("Attachments deleted: ", res);
        } );
      }
 this.addedFiles = [];
      this.removedFiles=[];
      this.storyClicked.emit(false);
     
    }
    //close the story modal

    //push the new story to the stories array
    console.log(this.stories);
  }

  deleteItem() {
    console.log("deleteItem called");
    this.storyService.deleteStory(this.storyId).subscribe(() => {
      console.log("Story deleted");
    });
    this.storyClicked.emit(false);

  }

  subscribe() {
    console.log(this.userEmail);
    const obj = {
      storyId: this.storyId,

      //list of emails
      userEmail: [this.userEmail]
    };
    console.log("subscribe called");
    console.log(obj);

    this.storyService.subscribeToStory(obj).subscribe((res) => {
      console.log("Subscribed to story");
      console.log(res);
      this.storyService.getAllSubscriptions().subscribe((subscriptions) => {
        this.subscriptions = subscriptions;
        console.log("All Subscriptions: ", this.subscriptions);
      });
    });

  }

  isNotSubscribed(): boolean {

    console.log(this.subscriptions);
    console.log(this.storyId);
    console.log(this.userEmail);
    const subscription = this.subscriptions.find(sub => sub.storyId === this.storyId && sub.userEmail.includes(this.userEmail));
    console.log("Subscription found: ", subscription);
    if (subscription) {
      return false;
    } else {
      return true;
    }

  }

  unSubscribe() {
    console.log(this.userEmail);
    const obj = {
      storyId: this.storyId,
      userEmail: [this.userEmail]
    }
    console.log("unsubscribe called");
    this.storyService.unsubscribeFromStory(obj).subscribe((res) => {
      console.log("Unsubscribed from story");
      console.log(res);
      this.storyService.getAllSubscriptions().subscribe((subscriptions) => {
        this.subscriptions = subscriptions;
        console.log("All Subscriptions: ", this.subscriptions);
      });
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log(this.selectedFile);
    //clear the selected file

    event.target.value = null;
    this.addedFiles.push(file);
  }

  //Download the attachment
  downloadFile(fileName: string) {
    console.log("Downloading file: ", fileName);
    let file: Attachment | undefined = this.attachments.find(file => {
      return file.fileName === fileName;
    });
    var fileToDownload;
    if(file) {
       fileToDownload = new File(
        [this.base64ToBlob(file.fileData, file.fileType)],
        file.fileName,
        { type: file.fileType }
      );
    }
    else if (!file) {
        fileToDownload = this.addedFiles.find(f => f.name === fileName) as any;
    }
      const url = URL.createObjectURL(fileToDownload);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileToDownload.name;

      a.click();

      URL.revokeObjectURL(url);
    

  }

  base64ToBlob(base64: string, contentType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  deleteFile(file: Attachment | File) {
    console.log(file);
    if( file instanceof File) {
      this.addedFiles = this.addedFiles.filter(f => f.name !== file.name);
      return;
    } else {
      const removedFile = this.attachments.find(f => f.fileName == file.fileName);
    if (removedFile) {
      this.removedFiles.push(removedFile.id);
      this.attachments = this.attachments.filter(f => f.fileName !== file.fileName);
    }
    }
    /*const removedFile = this.attachments.find(f => f.fileName == file.fileName);
    if (removedFile) {
      this.removedFiles.push(removedFile.id);
    } else {
      this.addedFiles = this.addedFiles.filter(f => f.name !== file.fileName);
    }*/
  }

  

}
