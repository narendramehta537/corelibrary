import { inherits } from "util";

export class QueryModels {
}

export interface IQueryModel {
    RequestType?: RequestType;
    Url?: string;
    Body?: any;
    Form?: any | Map<string, string>;
}
export type RequestType = 'GET' | 'PUT' | 'POSTFORM' | 'POST' | 'DELETE';

export class QueryModel {
    constructor(queryModel: IQueryModel) {
        Object.keys(queryModel).forEach((key) => {
            this[key] = queryModel[key];
        });
    }

    RequestType: RequestType = 'GET';
    Url: string;
    Body: any;
    Form: any;
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

export interface PostDetails {
    id?: string,
    captions?: string[],
    likes?: number,
    comments?: number,
    displayUrls?: string[]
}

export interface PageDetails {
    cursor?: string;
    cursorData?: any;
    postNumber?: number;
}