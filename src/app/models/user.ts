export class User {
    userId!: number;
    email!: string;
    constructor(userId: number, email: string) {
        this.userId = userId;
        this.email = email;
    }
}