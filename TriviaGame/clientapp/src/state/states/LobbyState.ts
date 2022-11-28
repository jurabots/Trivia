import State from "../State";
import TriviaGame from "../../TriviaGame";
import GameEvent from "../GameEvent";
import {
    gameSettings
} from "../../Helpers/GameSettings";
import LobbyScene from "../../Scenes/LobbyScene";
import {
    gameData
} from "../../Helpers/GameData";
import TopicsScene from "../../Scenes/TopicsScene";
import MultiplayerServer from "../../Server/MultiplayerServer";
import TopicsState from "./TopicsState";

export default class LobbyState extends State {

    constructor(game: TriviaGame) {
        super(game);
    }

    public async changeState(event: GameEvent): Promise < State > {
        const incomingMethodsNames = gameSettings.signalrIncomingMethodsNames;
        let nextState: State = this; //default
        switch (event.method) {
            case "ingame": {
                switch (event.data.name) {
                    case "play": {
                        const scene = ( < LobbyScene > this.game.currentScene);
                        scene.startSerachingForOpponent();
                        const currentCharIndex = scene.charactersSlider.currentSlide - 1;
                        MultiplayerServer.instance.join(gameData.charsNames[currentCharIndex]);
                    }
                    break;
                }
            }
            break;
        case incomingMethodsNames.opponentJoined: {
            const scene = ( < LobbyScene > this.game.currentScene);

            this.game.opponentPlayer.name = event.data.name;
            this.game.opponentPlayer.color = event.data.color;
            this.game.opponentPlayer.isGameOrganizer = event.data.isGameOrganizer;
            this.game.player.isGameOrganizer = this.game.opponentPlayer.isGameOrganizer ? false : true;
            scene.prepareCharacters();
        }
        break;
        case incomingMethodsNames.canPlay: {
            this.game.scenes.topicsScene = new TopicsScene({
                game: this.game,
                name: "topicsScene"
            });
            this.game.showScene(this.game.scenes.topicsScene);

            nextState = new TopicsState(this.game);
        }
        break;
        case incomingMethodsNames.opponentLeave: {
            this.onOpponentLeave();
        }
        break;
        }
        return nextState;
    }
}