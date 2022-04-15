export interface User {
    userId?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: string;
}

export interface Reviewer {
    reviewerId?: number;
    reviewerName?: string;
}