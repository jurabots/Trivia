declare function require(name: string);
require("babel-core/register");
require("babel-polyfill");
import Player from './Player';
import Character from './Elements/Character';
import TriviaGame from './TriviaGame';
import { gameSettings } from './Helpers/GameSettings';

new class Main {

    player: Player;
    character: Character;
    game: TriviaGame;

    constructor() {
        this.requestApiUrl();
        this.initGame();
    }

    private requestApiUrl(){
        const url = prompt("Input the root API url (or live the field empty to use the default one)", gameSettings.serverUrl);
        gameSettings.serverUrl = url;
    }

    private initGame(): void {
        //application entry point
        this.player = new Player({
            name: "Player",
            avatarSource: "player_ava"
        });
        this.character = new Character({
            name: 'Red',
            charPath: 'characters/Red/Red_character.json',
            // width: 360,
            // height: 463,
            preloadName: 'idle_lobby',
            preloadX: 570,
            preloadY: 1200,
            mainName: 'idle_lobby',
            mainX: 266,
            mainY: 1070,
            zOrder: 100
        });
        this.game = new TriviaGame({
            player: this.player,
            width: 1126,
            height: 2435,
            character: this.character
        });
        this.game.init();
    }
}