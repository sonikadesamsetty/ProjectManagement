import { Comment } from "./comment";

export class Task {
    public id!: number;
    public title!: string;
    public description!: string;
    public status!: string
    public assignedTo!: string;
    public discussion!: string;
    public priority!: string;
    public storyId!: number;
    public totalHours!: number;
    public remainingHours!: number;
    public completedHours!: number;
    public sprintId!: number;
    public expanded: boolean = false;
  comments!: Comment[];
    constructor(id: number, title: string, description: string, status: string, assignedTo: string, discussion: string, priority: string, storyId: number, totalHours: number, remainingHours: number, completedHours: number, sprintId: number) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.assignedTo = assignedTo;
        this.discussion = discussion;
        this.priority = priority;
        this.storyId = storyId;
        this.totalHours = totalHours;
        this.remainingHours = remainingHours;
        this.completedHours = completedHours;
        this.sprintId = sprintId;
    }

}