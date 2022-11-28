import State from "../State";
import TriviaGame from "../../TriviaGame";
import GameEvent from "../GameEvent";
import {
    gameSettings
} from "../../Helpers/GameSettings";
import MultiplayerServer from "../../Server/MultiplayerServer";
import LobbyState from "./LobbyState";
import TopicsState from "./TopicsState";
import QuestionScene from "../../Scenes/QuestionScene";

export default class ResultState extends State {

    constructor(game: TriviaGame) {
        super(game);
    }

    public async changeState(event: GameEvent): Promise < State > {
        const incomingMethodsNames = gameSettings.signalrIncomingMethodsNames;
        let nextState: State = this; //default
        switch (event.method) {
            case "ingame": {
                switch (event.data.name) {
                    case "playAgain": {
                        MultiplayerServer.instance.send(event.data);
                        this.game.player.isGameOrganizer = true;
                        this.game.opponentPlayer.isGameOrganizer = false;
                        const scene = ( < QuestionScene > this.game.currentScene);
                        scene.executePlayAgain();
                        this.onPlayAgain();
                        nextState = new TopicsState(this.game);
                    }
                    break;
                    case "exit": {
                        const scene = ( < QuestionScene > this.game.currentScene);
                        scene.executeExit();
                        this.onOpponentLeave();
                        nextState = new LobbyState(this.game);
                    }
                    break;
                }
            }
            break;

        case incomingMethodsNames.send: {
            switch (event.data.name) {
                case "playAgain": {
                    this.game.player.isGameOrganizer = false;
                    this.game.opponentPlayer.isGameOrganizer = true;
                    const scene = ( < QuestionScene > this.game.currentScene);
                    scene.hideAllPopups();
                    this.game.infoPopup.show("Your opponent inited a new game.")
                    this.onPlayAgain();
                    nextState = new TopicsState(this.game);
                }
                break;
            }
        }
        break;

        case incomingMethodsNames.opponentLeave: {
            const scene = ( < QuestionScene > this.game.currentScene);
            scene.hideAllPopups();
            this.onOpponentLeave();
            nextState = new LobbyState(this.game);
        }
        break;
        }
        return nextState;
    }
}