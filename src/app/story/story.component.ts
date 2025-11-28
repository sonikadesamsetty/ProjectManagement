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
 
  stories : Story[]= [];

  story: Story | undefined;

  @Input() storyId: number | 0 = 0;

  @Output() storyClicked = new EventEmitter<boolean>(true);

  @Input() itemType: string | undefined;

  @Input() projectId!: number;

  members : Member[] = [];

  projectService = inject(ProjectService);
  userService = inject(UserService);
  userEmail!: string;

  states = ['New', 'Grooming', 'Active', 'Development', 'ReadyForReview','ReadyForTesting','Closed'];


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
    console.log(this.userEmail);
    console.log("Project ID: ", this.projectId);

    this.storyService.getAllSubscriptions().subscribe((subscriptions)=>{
      this.subscriptions = subscriptions;
      console.log("All Subscriptions: ", this.subscriptions);
    });

    this.sprintService.getSprints().subscribe(sprints=>
      {
        this.allSprints = sprints;
        this.filteredSprints = sprints.filter(sprint=>sprint.projectId==this.projectId);
        console.log("Filtered Sprints: ", this.filteredSprints);
  });

  this.projectService.getProjectMembers().subscribe(members=>{
    members.forEach(member=>{
      if(member.projectId == this.projectId){
        this.members.push(member);
      }
    });
    this.storyService.getStories().subscribe(stories => {
      this.stories = stories;
      if (this.storyId>0) {
      console.log(this.storyId);
      this.story = this.stories.find((s: { id: number | null; }) => s.id === this.storyId) ?? undefined;
      console.log(this.story);
      console.log(this.members);
      const assignedTo = this.members.find(member => member.id == Number(this.story?.assignedTo))?.name || '';
      const sprintName = this.allSprints.find(sprint => sprint.id == this.story?.sprintId)?.name || '';
this.existingSprintName=sprintName;    
this.existingAssignedToName=assignedTo; 
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
    if(this.storyId == 0) {
      //create a new story
      const newStory = new Story(0, this.storyForm.value.title || '', this.storyForm.value.description || '', this.storyForm.value.status || '', this.storyForm.value.assignedTo || '', this.storyForm.value.discussion || '', this.storyForm.value.priority || '', this.storyForm.value.capacity || 0, this.storyForm.value.dor || '', this.storyForm.value.acceptanceCriteria || '', this.storyForm.value.sprintId, this.itemType || 'story');
      console.log("Creating new story:", newStory);
      const response = await this.storyService.addStory(newStory);
      console.log("story created: " , response);
      this.storyClicked.emit(false);
    } else {
      //update the existing story
      const updatedStory = new Story(this.storyId || 0, this.storyForm.value.title || this.story?.title, this.storyForm.value.description || this.story?.description, this.storyForm.value.status || this.story?.status, this.storyForm.value.assignedTo || this.story?.assignedTo, this.storyForm.value.discussion || this.story?.discussion, this.storyForm.value.priority || this.story?.priority, this.storyForm.value.capacity || this.story?.capacity, this.storyForm.value.dor || this.story?.dor, this.storyForm.value.acceptanceCriteria || this.story?.acceptanceCriteria, this.storyForm.value.sprintId|| this.story?.sprintId, this.itemType || this.story?.itemType || 'story');
      console.log("Updating story:", updatedStory);
      this.storyService.updateStory(updatedStory);
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

  addAttachment() {
    console.log("addAttachment called");
    //open a file dialog to select a file
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = e => {
      //get the selected files
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          console.log(file);
          //upload the file to the server
          //...
        } 
      }
    };
    input.click();
    
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
       this.storyService.getAllSubscriptions().subscribe((subscriptions)=>{
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
      if(subscription) {
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
       this.storyService.getAllSubscriptions().subscribe((subscriptions)=>{
      this.subscriptions = subscriptions;
      console.log("All Subscriptions: ", this.subscriptions);
    });
    });
  }


}
