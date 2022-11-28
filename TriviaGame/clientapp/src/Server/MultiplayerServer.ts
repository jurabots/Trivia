import * as signalR from "@microsoft/signalr";
import {
    gameSettings
} from "../Helpers/GameSettings";
import {
    EventEmitter
} from "events";

export default class MultiplayerServer {
    private static _instance: MultiplayerServer = null;
    private hubConnection: signalR.HubConnection;
    private apiUrl: string = gameSettings.serverUrl + "/trivia"; //"https://localhost:44399/trivia";//
    private incomingMethodsNames = gameSettings.signalrIncomingMethodsNames;
    private serverMethodsNames = gameSettings.signalrServerMethodsNames;

    private callbacks = [];
    private _connectionId = null;

    private emitter: EventEmitter = new EventEmitter();


    private constructor() {}

    public static get instance(): MultiplayerServer {
        if (!MultiplayerServer._instance) {
            MultiplayerServer._instance = new MultiplayerServer();
        }
        return MultiplayerServer._instance;
    }

    public get connectionId() {
        return this._connectionId;
    }


    public async init(): Promise < void > {
        this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(this.apiUrl)
        .build();

        this.hubConnection.on(this.incomingMethodsNames.send, (data) => {
            console.log(`Data received: ${data}`);
            try{
                const message = JSON.parse(data);
                this.emitter.emit(this.incomingMethodsNames.send, message);
            }
            catch(ex){
                console.log(`Send method parsing data error: ${ex}`);
            }
        });

        this.hubConnection.on(this.incomingMethodsNames.opponentJoined, (name, color, isGameOrganizer) => {
            console.log(`Opponent joined: ${name} ${color}, is game organizer: ${isGameOrganizer}`);
            this.emitter.emit(this.incomingMethodsNames.opponentJoined, name, color, isGameOrganizer);
        });

        this.hubConnection.on(this.incomingMethodsNames.opponentLeave, () => {
            console.log(`Opponent Leave`);
            this.emitter.emit(this.incomingMethodsNames.opponentLeave);
        });

        this.hubConnection.on(this.incomingMethodsNames.canPlay, () => {
            console.log(`Can play`);
            this.emitter.emit(this.incomingMethodsNames.canPlay);
        });

        await this.hubConnection.start();
        this._connectionId = this.hubConnection.connectionId;
        console.log(`Connection ID: ${this._connectionId}`);
        
    }

    public onMessage(callback): void {
        this.emitter.on(this.incomingMethodsNames.send, callback);
    }

    public onOpponentJoined(callback){
        this.emitter.on(this.incomingMethodsNames.opponentJoined, callback);
    }

    public onOpponentLeave(callback){
        this.emitter.on(this.incomingMethodsNames.opponentLeave, callback);
    }

    public onCanPlay(callback){
        this.emitter.on(this.incomingMethodsNames.canPlay, callback);
    }

    public offMessage(methodName, callback = null) {
        this.emitter.on(methodName, callback);
    }

    public send(data: object): void {
        const message = JSON.stringify(data);
        this.hubConnection.invoke(this.serverMethodsNames.send, message);
    }

    public join(charColor) {
        this.hubConnection.invoke(this.serverMethodsNames.join, charColor);
    }

    public leave() {
        this.hubConnection.invoke(this.serverMethodsNames.leave);
        console.log("LEAVE invoked");
        
    }
}