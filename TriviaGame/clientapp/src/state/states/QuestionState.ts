import State from "../State";
import TriviaGame from "../../TriviaGame";
import GameEvent from "../GameEvent";
import {
    gameSettings
} from "../../Helpers/GameSettings";
import MultiplayerServer from "../../Server/MultiplayerServer";
import QuestionScene from "../../Scenes/QuestionScene";
import ResultState from "./ResultState";
import LobbyState from "./LobbyState";

export default class QuestionState extends State {

    constructor(game: TriviaGame) {
        super(game);
    }

    public async changeState(event: GameEvent): Promise < State > {
        const incomingMethodsNames = gameSettings.signalrIncomingMethodsNames;
        let nextState: State = this; //default
        switch (event.method) {
            case "ingame": {
                switch (event.data.name) {
                    case "answerIndex": {
                        MultiplayerServer.instance.send(event.data);
                    }break;
                    case "gameCompleted": {
                        nextState = new ResultState(this.game);
                    }break;
                }
            }
            break;
        case incomingMethodsNames.send: {
            switch (event.data.name) {
                case "answerIndex": {
                    const scene = ( < QuestionScene > this.game.currentScene);
                    scene.processOpponentAnswer(event.data.index);
                }
                break;
            }
        }
        break;
        case incomingMethodsNames.opponentLeave: {
            this.onOpponentLeave();
            nextState = new LobbyState(this.game);
        }
        break;
        }
        return nextState;
    }
}