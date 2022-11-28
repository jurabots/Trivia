import TriviaGame from "src/TriviaGame";
import State from "./State";
import GameEvent from "./GameEvent";
import LobbyState from "./states/LobbyState";

export default class GameStateMachine {

    private static _instance: GameStateMachine = null;
    private constructor() {}

    public static get instance(): GameStateMachine {
        if (!GameStateMachine._instance) {
            GameStateMachine._instance = new GameStateMachine();
        }
        return GameStateMachine._instance;
    }

    private game: TriviaGame;
    private currentState: State;


    public init(game: TriviaGame): void {
        this.game = game;
        this.currentState = new LobbyState(this.game);
    }

    public async processEvent(event: GameEvent): Promise < void > {
        this.currentState = await this.currentState.changeState(event);
    }
}