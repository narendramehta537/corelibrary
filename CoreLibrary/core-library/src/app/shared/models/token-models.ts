export interface UserData {
    userName: string;
    firstName: string;
    lastName: string;
}

export interface TokenModel {
    token: string;
    expires: number;
    token_type: string;
    isAdmin: boolean;
    userData: UserData;
    account: string;
}