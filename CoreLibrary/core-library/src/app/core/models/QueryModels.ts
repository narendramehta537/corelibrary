import { inherits } from "util";

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

export interface ISocialQueryModel {
    UserName: string;
    Cursor?: string;
}
export class SocialQueryModel implements ISocialQueryModel {
    constructor(query: ISocialQueryModel) {
        this.UserName = query.UserName;
        if (query.Cursor) this.Cursor = query.Cursor;
    }
    UserName: string;
    Cursor?: string;
}