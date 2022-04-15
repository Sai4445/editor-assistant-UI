export interface CustomResponse {
    status?: string;
    message?: string;
    data?: any;
}

export enum ResponseStatus {
    SUCCESS = 'SUCCESS', 
    FAIL = 'FAIL'
}