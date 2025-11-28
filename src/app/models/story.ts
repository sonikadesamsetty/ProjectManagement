import { Task } from "./task";

export class Story {
    public id!: number;
    public title!: string;
    public description!: string;
    public status!: string
    public assignedTo!: string;
    public discussion!: string;
    public priority!: string;
    public capacity!: number;
    public dor!: string
    public acceptanceCriteria!: string;
    public sprintId!: number;
    public tasks: Task[] = [];
    public expanded: boolean = false;
    public itemType!: string;
    constructor(id: number, title: string, description: string, status: string, assignedTo: string, discussion: string, priority: string, capacity: number, dor: string, acceptanceCriteria: string, sprintId: number, itemType: string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.assignedTo = assignedTo;
        this.discussion = discussion;
        this.priority = priority;
        this.capacity = capacity;
        this.dor = dor;
        this.acceptanceCriteria = acceptanceCriteria;
        this.sprintId = sprintId;
        this.itemType = itemType;
    }
}