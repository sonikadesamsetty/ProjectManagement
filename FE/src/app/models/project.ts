import { Member } from "./members";

export class Project {
    
  public id!: number;
  public name!: string;
  public description!: string;
  public startDate!: Date;
  public endDate!: Date;
  public createdBy!: string;
  public modifiedBy!: string;
  public createdAt!: Date;
  public modifiedAt!: Date;
  public projectMembers: Member[];
    constructor(id: number, name: string, description: string, startDate: Date, endDate: Date, createdBy: string, modifiedBy: string, createdAt: Date, modifiedAt: Date, projectMembers: Member[]) {      
        this.id = id;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdBy = createdBy;
        this.modifiedBy = modifiedBy;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
        this.projectMembers = projectMembers;
    }

}