export class Attachment{
    public id!: number;
    public fileName!: string;
    public fileSize!: number;
    public fileType!: string;
    public fileData!: any;
    constructor(id: number, fileName: string, fileSize: number, fileType: string, fileData: any) {
        this.id = id;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.fileType = fileType;
        this.fileData = fileData;
    }
}