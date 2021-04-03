export class QueryModels {
}


export class FileQueryModel {
    constructor(url: string, fileName?: string) {
        this.Url = url;
        if (fileName) this.FileName = fileName;
    }
    Url: string;
    FileName?: string;
}