import State from "../State";
import TriviaGame from "../../TriviaGame";
import GameEvent from "../GameEvent";
import {
    gameSettings
} from "../../Helpers/GameSettings";
import MultiplayerServer from "../../Server/MultiplayerServer";
import QuestionScene from "../../Scenes/QuestionScene";
import QuestionState from "./QuestionState";
import LobbyState from "./LobbyState";

export default class TopicsState extends State {

    constructor(game: TriviaGame) {
        super(game);
    }

    public async changeState(event: GameEvent): Promise < State > {
        const incomingMethodsNames = gameSettings.signalrIncomingMethodsNames;
        let nextState: State = this; //default
        switch (event.method) {
            case "ingame": {
                //only game organizer can invoke events for this state
                if (this.game.player.isGameOrganizer) {
                    switch (event.data.name) {
                        case "topicSelected":{
                            MultiplayerServer.instance.send(event.data);
                        }break;
                        case "questionGot": {
                            MultiplayerServer.instance.send(event.data);
                            nextState = new QuestionState(this.game);
                        }
                        break;

                        case "exit": {
                            MultiplayerServer.instance.send(event.data);
                            this.onOpponentLeave(false);
                            nextState = new LobbyState(this.game);
                        }
                        break;
                    }
                }
            }
            break;
        case incomingMethodsNames.send: {
            switch (event.data.name) {
                case "topicSelected": {
                    this.game.infoPopup.show(`Topic selected: ${event.data.topic.name}`);
                }
                break;
            case "questionGot": {
                if (this.game.scenes.questionScene !== null)
                    this.game.destroyScene(this.game.scenes.questionScene);
                this.game.scenes.questionScene = new QuestionScene({
                    game: this.game,
                    name: "questionsScene",
                    question: event.data.question
                });
                this.game.showScene(this.game.scenes.questionScene);
                nextState = new QuestionState(this.game);
            }
            break;
            case "exit": {
                this.onOpponentLeave(false);
                nextState = new LobbyState(this.game);
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