export interface Event {
    eventId: number;
    eventName?: string;
    description?: string;
    startDateTime?: Date;
    endDateTime?: Date;
    createdBy?: string;
    createdDate?: Date;
    modifiedBy?: string;
    modifiedDate?: Date;
    registered?: boolean;
}