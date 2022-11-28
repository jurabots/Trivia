export default class GameEvent{
    public method: string;
    public data: any;

    constructor(method: string, data: any) {
        this.method = method;
        this.data = data;
    }
}