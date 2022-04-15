import { Event } from "./Event";

export interface Paper {
    event?: Event;
    eventId?: number;
    paperId?: number;
    authorName?: string;
    reviewer1Name?: string;
    reviewer2Name?: string;
    reviewer3Name?: string;
    reviewer1Score?: number;
    reviewer2Score?: number;
    reviewer3Score?: number;
    reviewer1?: number;
    reviewer2?: number;
    reviewer3?: number;
    authorId?: number;
    reviewer1Feedback?: string;
    reviewer2Feedback?: string;
    reviewer3Feedback?: string;
    paperStatus?: string;
    averageScore?: number;
    paperAttachement?: any;
}