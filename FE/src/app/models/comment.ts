export class Comment {
    public id!: number;
    public description!: string;
    public createdBy!: string;
    public createdAt!: Date;
    public modifiedBy!: string;
    public modifiedAt!: Date;
    public taskId!: number;
    public storyId!: number;

    constructor(id: number, description: string, createdBy: string,createdAt: Date, modifiedBy: string,modifiedAt: Date, taskId: number, storyId: number) {
        this.id = id;
        this.description = description;
        this.createdBy = createdBy;
        this.modifiedBy = modifiedBy;
        this.taskId = taskId;
        this.storyId = storyId;
        this.createdAt = new Date();
        this.modifiedAt = new Date();
    }
}