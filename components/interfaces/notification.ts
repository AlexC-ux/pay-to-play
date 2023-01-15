export interface INotification {
    id: string,
    time: Date,
    title: string,
    text: string,
    new: boolean,
    userId: string,
}