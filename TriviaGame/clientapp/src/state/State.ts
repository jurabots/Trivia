import GameEvent from "./GameEvent";
import TriviaGame from "../TriviaGame";
import MultiplayerServer from "../Server/MultiplayerServer";
import LobbyScene from "../Scenes/LobbyScene";
import TopicsScene from "../Scenes/TopicsScene";

export default abstract class State {

    protected game: TriviaGame;

    constructor(game: TriviaGame) {
        this.game = game;
    }

    public abstract changeState(event: GameEvent): Promise < State > ;

    protected async onOpponentLeave(showInfo = true): Promise < void > {
        if(showInfo){
            await this.game.infoPopup.show("Your opponent has left the game.");
        }
        MultiplayerServer.instance.leave();
        if (this.game.currentScene !== null){
            this.game.destroyScene(this.game.currentScene);
        }
        this.game.scenes.lobbyScene = new LobbyScene({
            game: this.game,
            name: "lobbyScene"
        });
        this.game.showScene(this.game.scenes.lobbyScene);
    }

    protected onPlayAgain():void{
        this.game.scenes.topicsScene = new TopicsScene({
            game: this.game,
            name: "topicsScene"
        });
        this.game.showScene(this.game.scenes.topicsScene);
    }
}