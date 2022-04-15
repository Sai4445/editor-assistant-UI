import { Reviewer, User } from "./User";
import { Event } from "./Event";
export class UtilityClass {


    static getUserByUserId(userId: any): User | undefined {
        let users: any = localStorage.getItem('users');
        const usersList: User[] = JSON.parse(users);
        console.log('req userId:', userId);
        console.log('usersList:', usersList);
        return usersList.find(user => user.userId === userId);
    }

    static getReviewerById(id: any): Reviewer | undefined {
        let reviewers: any = localStorage.getItem('reviewers');
        const reviewerList: Reviewer[] = JSON.parse(reviewers);
        console.log('req rewier id:', id);
        console.log('reviewerList:', reviewerList);
        return reviewerList.find(reviewer => reviewer.reviewerId === id);
    }

    static getEventById(id: any): Event | undefined {
        let events: any = localStorage.getItem('events');
        const eventList: Event[] = JSON.parse(events);
        console.log('req event id:', id);
        console.log('eventList:', eventList);
        return eventList.find(event => event.eventId === id);
    }

    static addEventsToLocalStorage(value: any) {
        localStorage.setItem('events', JSON.stringify(value));
    }

    static addUsersToLocalStorage(value: any) {
        localStorage.setItem('users', JSON.stringify(value));
    }

    static addReviewersToLocalStorage(value: any) {
        localStorage.setItem('reviewers', JSON.stringify(value));
    }

    static addToLocalStorage(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    static removeFromLocalStorage(key: string) {
        localStorage.removeItem(key);
    }

}