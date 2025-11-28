export class Member {
    public id!: number;
    public name!: string;
    public createdAt!: Date;
    public projectId!: number;
    public role!: string;

    constructor(id: number, name: string, createdAt: Date, projectId: number, role: string) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.projectId = projectId;
        this.role = role;
    }


}