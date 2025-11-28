export class Sprint {
  public id!: number;
  name: string;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  modifiedBy: string;
  createdAt: Date;
  modifiedAt: Date;
  projectId: number;

  constructor(
    id: number,
    name: string,
    startDate: Date,
  endDate: Date,
    createdBy: string,
    modifiedBy: string,
    createdAt: Date,
    modifiedAt: Date,
    projectId: number
  ) {
    this.id = id;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.createdBy = createdBy;
    this.modifiedBy = modifiedBy;
    this.createdAt = createdAt;
    this.modifiedAt = modifiedAt;
    this.projectId = projectId;
  }
}