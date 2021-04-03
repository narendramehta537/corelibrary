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

export class SocialQueryModel {
    constructor(userName: string, cursor?: string) {
        this.UserName = userName;
        if (cursor) this.Cursor = cursor;
    }
    UserName: string;
    Cursor?: string;
}