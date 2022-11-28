import Game from './SuperClasses/Game';
import {
    ColorsEnum
} from './Helpers/ColorsEnum';
import LobbyScene from './Scenes/LobbyScene';
import TopicsScene from './Scenes/TopicsScene';
import Character from './Elements/Character';
import Popup from './Elements/Popup';
import FunctionsLib from './Helpers/FunctionsLib';
import Question from './Elements/Question';
import Player from './Player';
import MyLoader from './Helpers/MyLoader';
import {
    gameData
} from "./Helpers/GameData";
import MultiplayerServer from './Server/MultiplayerServer';
import LeaderboardPopup from './Elements/LeaderboardPopup';
import ApiServer from './Server/ApiServer';
import GameStateMachine from './state/GameStateMachine';
import GameEvent from './state/GameEvent';
import { gameSettings } from './Helpers/GameSettings';
import InfoPopup from './Elements/InfoPopup';


/*
Constructor of this class takes object with such fields:
player - instance of Player class, required
width - width of stage in px, required
height - height of stage in px, required
character -  instance of Character class, required
*/

export default class TriviaGame extends Game {

    public bet: number;
    public win: number;
    public opponentPlayer: Player;
    public opponentCharacter: Character;
    public animatedCharsList;
    public currentQuestion: Question;
    public lobbyAssetsLoaded: boolean;
    public mainAssetsLoaded: boolean;
    public lobbyLoader: PIXI.loaders.Loader;
    public avatarsLoaders: PIXI.loaders.Loader[] = [];
    public gameplayLoader: PIXI.loaders.Loader;

    public howToPlayPopup: Popup;
    public leaderboardPopup: LeaderboardPopup;
    public infoPopup: InfoPopup;

    constructor(options) //params: Player instance, width and height of the play field
    {
        super(options);
        this.bet = 10;
        //amount of coins user wins
        this.win = 0;

        //opponent:
        this.opponentPlayer = new Player({});
        this.opponentCharacter = null;

        //scenes:
        this.scenes.lobbyScene = null;
        this.scenes.topicsScene = null;
        this.scenes.questionScene = null;

        //popup:
        this.howToPlayPopup = null;

        //question data:
        this.currentQuestion = null;

        this.lobbyAssetsLoaded = false;
        this.mainAssetsLoaded = false;

        //init state machine
        this.initStateMachine();

    }

    protected initStateMachine() {
        GameStateMachine.instance.init(this);

        //register multiplayer messages processing: 
        const incomingMethodsNames = gameSettings.signalrIncomingMethodsNames;
        
        MultiplayerServer.instance.onMessage((data)=>{
            const gameEvent = new GameEvent(incomingMethodsNames.send, data);
            GameStateMachine.instance.processEvent(gameEvent);
        });

        MultiplayerServer.instance.onOpponentJoined((name, color, isGameOrganizer)=>{
            const gameEvent = new GameEvent(incomingMethodsNames.opponentJoined, {
                name: name,
                color: color,
                isGameOrganizer: isGameOrganizer
            });
            GameStateMachine.instance.processEvent(gameEvent);
        });

        MultiplayerServer.instance.onOpponentLeave(()=>{
            const gameEvent = new GameEvent(incomingMethodsNames.opponentLeave, null);
            GameStateMachine.instance.processEvent(gameEvent);
        });

        MultiplayerServer.instance.onCanPlay(()=>{
            const gameEvent = new GameEvent(incomingMethodsNames.canPlay, null);
            GameStateMachine.instance.processEvent(gameEvent);
        });
    }

    /*______________________INHERITED MEMBERS___________________*/

    protected async getData(): Promise < void > {
        return new Promise(resolve => {
            //get data from server 
            resolve();
        });
    }


    protected clearGameProperties(): void {

        this.win = 0;
        this.scenes.questionScene = null;
        this.currentScene = null;
        this.currentQuestion = null;
        this.opponentPlayer = new Player({});
    }

    //creating scene and placing it on stage
    //no params
    //returns void
    protected async buildStage(): Promise < void > {
        //creating main container and placing it on the stage
        super.buildStage();

        await MultiplayerServer.instance.init(); //init multiplayer
       
        if (this.gamesCounter <= 1) {
            this.scenes.lobbyScene = new LobbyScene({
                game: this,
                name: "lobbyScene"
            });
            this.showScene(this.scenes.lobbyScene);
        } else {
            this.scenes.topicsScene = new TopicsScene({
                game: this,
                name: "topicsScene"
            });
            this.showScene(this.scenes.topicsScene);
        }
        this.addHowToPlayPopup();
        this.addLeaderboardPopup();
        this.addInfoPopup();
    }

    public async playAgain(start: boolean): Promise < void > {
        super.playAgain(start);
        this.changeCharacter(null);
        this.changeOpponentCharacter(null);
    }

    /*______________________LOADING ASSETS___________________*/
    //implementation of the parent class method   
    protected async loadLobbyAssets(): Promise < void > {
        if (this.lobbyAssetsLoaded === true) {
            return;
        }
        this.lobbyLoader = MyLoader.loader;
        //adding all lobby resources we need to loader:
        this.lobbyLoader
        //backgrounds:
        .add('lobby_bg_animation', 'lobby_bg_animation/Trivia_lobby_screen.json')
        .add('leaderboard_bg', 'Leaderboard_bg.png')
        .add('topics_bg_part', 'bg_update_part2.png')

        //how to play elements
        .add('how_to_play_bg', 'H_to_p.png')

        //ui elements:
        .add('close_icon', 'close_icon.png')
        .add('btn_orange', 'button_active.png')
        .add('btn_purple', 'button.png')

        //buttons:
        .add('arrow_left', 'arrow_left.png')
        .add('arrow_right', 'arrow_right.png')

        //characters:
        .add('mystery_char', 'characters/Mystery/Mystery.json', gameData.mysterySpineLoaderOptions)
        .add('yellow_char', 'characters/Yellow/Yellow.json', gameData.spineLoaderOptions)
        .add('red_char', 'characters/Red/Red_character.json', gameData.spineLoaderOptions)
        .add('nerdy_char', 'characters/Nerdy/Nerdy.json', gameData.spineLoaderOptions)
        .add('blue_char', 'characters/Blue/Blue.json', gameData.spineLoaderOptions)
        .add('gem_monster_char', 'characters/Gem_monster/Gem_monster_character.json', gameData.spineLoaderOptions)
        .add('gold_nugget_monster_char', 'characters/Gold_nugget_monster/Gold_nugget_monster.json', gameData.spineLoaderOptions)
        .add('cat_char', 'characters/Cat/Cat.json', gameData.spineLoaderOptions)
        .add('squirrel_char', 'characters/Squirrel/squirrel.json', gameData.spineLoaderOptions)
        .add('stripes-zebra_char', 'characters/Zebra/Stripes-zebra.json', gameData.spineLoaderOptions)
        .add('snail_char', 'characters/Snail/snail.json', gameData.spineLoaderOptions)
        .add('angel_char', 'characters/Angel/Angel.json', gameData.spineLoaderOptions)
        .add('zombie_char', 'characters/Zombie/zombie.json', gameData.spineLoaderOptions)
        .add('corgi_char', 'characters/Corgi/Corgi.json', gameData.spineLoaderOptions)
        .add('megadog_char', 'characters/Megadog/Megadog_character.json', gameData.spineLoaderOptions)
        .add('panda_char', 'characters/Red_panda/Red_panda_character.json', gameData.spineLoaderOptions)
        .add('cattle_char', 'characters/Cattle/Cattle_character.json', gameData.spineLoaderOptions)
        .add('dinorobot_char', 'characters/Dinorobot/Dinorobot_character.json', gameData.spineLoaderOptions);
        await MyLoader.loadAssets(this.lobbyLoader);
        this.animatedCharsList = this.getAnimatedCharacters();
        this.lobbyAssetsLoaded = true;
    }

    public async loadGameplayAssets(): Promise < void > {
        if (this.mainAssetsLoaded === true) {
            return;
        }
        this.gameplayLoader = MyLoader.loader;
        //adding all game resources we need to loader:
        this.gameplayLoader
        //backgrounds:
        .add('main_bg_animation', 'bg_animation/Trivia_gameplay_animation.json')

        //ui elements:
        .add('scroll_line', 'scroll1.png')
        .add('scroll_thumb', 'scroll2.png')
        .add('question_frame', 'trivia_frame.png')
        .add('player_ava', 'trivia_ava2.png')
        .add('opponent_ava', 'trivia_ava1.png')
        //pop-ups:
        .add('win_popup', 'win_pop_up_animation/Trivia_pop_up_win.json')
        .add('lose_popup', 'lose_pop_up_animation/Trivia_lose_pop_up.json')
        .add('draw_popup', 'draw_pop_up_animation/Trivia_draw_pop_up.json')
        //buttons:
        .add('btn_on_animation', 'buttons_animations/on/Trivia_gameplay_button_animation.json')
        .add('btn_off_animation', 'buttons_animations/off/Trivia_gameplay_button_animation.json')
        .add('question_btn', 'trivia_button2.png')
        .add('question_btn_active', 'trivia_button2_active.png')
        .add('question_btn_active_opponent', 'trivia_button2_active_opponent.png')

        await MyLoader.loadAssets(this.gameplayLoader);
        this.mainAssetsLoaded = true;
    }

    public async loadAvatars(keys: string[]): Promise < void > {
        let loader = null;
        //trying to find free loader in the pool:
        for (let i = 0; i < this.avatarsLoaders.length; i++) {
            if (!this.avatarsLoaders[i].loading) {
                loader = this.avatarsLoaders[i];
                break;
            }
        }
        if (!loader) { //free loader was not found
            loader = MyLoader.loader;
            this.avatarsLoaders.push(loader);
        }

        //adding all scene resources we need to loader:
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            //checking if avatars loaded:
            const winAvatarName = key + 'Avatar';
            if (!MyLoader.checkResourceLoaded(winAvatarName)) {
                loader.add(winAvatarName, gameData.charsData[key]['avatarWin']);
            }
            const loseAvatarName = key + 'AvatarLose';
            if (!MyLoader.checkResourceLoaded(loseAvatarName)) {
                loader.add(loseAvatarName, gameData.charsData[key]['avatarLose']);
            }
        }
        await MyLoader.loadAssets(loader);
    }


    /*____________________________POPUP_____________________________*/
    private addHowToPlayPopup(): void {
        this.howToPlayPopup = new Popup({
            name: "howToPlayPopup",
            x: 0,
            y: 0,
            resource: "how_to_play_bg",
            hasCloseIcon: true,
            closeIconResource: "close_icon",
            closeIconPosition: this.height > this.screenHeight ? {
                top: 150 + (this.height - this.screenHeight) / 2,
                right: 50
            } : {
                top: 50,
                right: 50
            },
            fontColor: ColorsEnum.white,
            hasLabel: true,
            fontSize: 50,
            app: this.app,
            maxHeight: this.height
        });

        ( < any > this.howToPlayPopup.shapeContainer).zOrder = 1000;
        this.mainContainer.addChild(this.howToPlayPopup.shapeContainer);
        FunctionsLib.sortContainerChildren(this.mainContainer);

        this.howToPlayPopup.setInvisible();

        this.howToPlayPopup.changeCloseIconCallback((event) => {
            event.stopPropagation();
            this.howToPlayPopup.disappearWithAlpha();
        });
    }

    private addLeaderboardPopup() {
        this.leaderboardPopup = new LeaderboardPopup({
            closeIconPosition: this.height > this.screenHeight ? {
                top: 150 + (this.height - this.screenHeight) / 2,
                right: 50
            } : {
                top: 50,
                right: 50
            },
            app: this.app,
            maxHeight: this.height
        });

        this.leaderboardPopup.onUpdateLeaderBoard(async (daysPeriod) => {
            const leaders = await ApiServer.instance.getLeaders(daysPeriod);
            this.leaderboardPopup.show(leaders);
        });

        this.mainContainer.addChild(this.leaderboardPopup.shapeContainer);
        FunctionsLib.sortContainerChildren(this.mainContainer);
    }

    private addInfoPopup() {
        this.infoPopup = new InfoPopup({
        
            app: this.app,
            maxHeight: this.height
        });

        this.mainContainer.addChild(this.infoPopup.shapeContainer);
        FunctionsLib.sortContainerChildren(this.mainContainer);
    }

    /*_____________________CHARACTERS______________________________*/

    private getAnimatedCharacters() {
        let charsList = Object.keys(gameData.charsData).map(key => gameData.charsData[key]);
        const animatedCharacters = [];
        for (let i = 0; i < charsList.length; i++) {
            const character = new Character({
                name: charsList[i].name,
                resourceName: charsList[i].resourceName,
                animationsList: charsList[i].animationsList,
                x: (this.width - 360) / 2,
                y: charsList[i].name === "Blue" ? 995 : charsList[i].name === "Cat" || charsList[i].name === "Corgi" ? 1030 : charsList[i].name === "Zombie" ? 1025 : 970,
                zOrder: 100
            });
            character.createAnimation();
            if (character.name === "Mystery")
                character.setAnimationByFullName(character.animationsList.idle_gameplay);
            else
                character.setAnimationByFullName(character.animationsList.idle_lobby);
            animatedCharacters.push(character.animation);
        }
        return animatedCharacters;
    }

    //adds opponent character on the stage
    //takes opponent Character instance (required)
    public addOpponentCharacter(character: Character): void {
        this.opponentCharacter = character;
        this.mainContainer.addChild(character.animation);
    }

    public setUpCharacters(charIndex: number, opponentCharIndex: number) {
        //player's character
        let charsList = Object.keys(gameData.charsData).map(key => gameData.charsData[key]);
        const charData = charsList[charIndex];
        //set up current character as main char:
        const character = new Character({
            name: charData.name,
            resourceName: charData.resourceName,
            animationsList: charData.animationsList,
            x: 266,
            y: charData.name === "Blue" ? 1100 : charData.name === "Cat" || charData.name === "Corgi" ? 1130 : charData.name === "Zombie" ? 1120 : 1065,
            zOrder: 100
        });
        character.createAnimation();
        character.setAnimationByFullName(character.animationsList.idle_gameplay);
        this.changeCharacter(character);


        //remove opponent character if exists
        if (this.opponentPlayer && this.opponentPlayer.character && this.opponentPlayer.character.isCreated()) {
            this.mainContainer.removeChild(this.opponentPlayer.character.animation);
        }

        const opponentData = opponentCharIndex < 0 ? gameData.mysteryCharData : charsList[opponentCharIndex];
        const opponentCharacter = new Character({
            name: opponentData.name,
            resourceName: opponentData.resourceName,
            animationsList: opponentData.animationsList,
            x: 880,
            y: opponentData.name === "Blue" ? 1100 : opponentData.name === "Cat" || opponentData.name === "Corgi" ? 1130 : opponentData.name === "Mystery" ? 1290 : opponentData.name === "Zombie" ? 1120 : 1065,
            zOrder: 100
        });
        opponentCharacter.createAnimation();
        opponentCharacter.setAnimationByFullName(opponentCharacter.animationsList.idle_gameplay);
        this.changeOpponentCharacter(opponentCharacter);

        //loading avatars for characters:
        const charsNames = [this.character.name, this.opponentCharacter && this.opponentCharacter.name !== "Mystery" ? this.opponentCharacter.name : "Red"];
        this.loadAvatars(charsNames);
    }

    //requires opponent character data from server
    //creates opponent character and adds it on stage
    public getOpponentIndex(getDefault: boolean = false): number {
        let opponentCharIndex: number = +new URLSearchParams(window.location.search).get("opponentChar") - 1;
        if (opponentCharIndex >= this.animatedCharsList.length || opponentCharIndex < 0)
            opponentCharIndex = -1; //Mystery

        if (getDefault) { //red is default
            opponentCharIndex = 0;
        }
        return opponentCharIndex;
    }

    //removes current character and adds a new one on the stage
    //takes new Character instance (required)
    public changeOpponentCharacter(newOpponentCharacter: Character): void {
        if (this.opponentPlayer && this.opponentPlayer.character && this.opponentPlayer.character.isCreated()) {
            this.mainContainer.removeChild(this.opponentPlayer.character.animation);
        }
        if (newOpponentCharacter instanceof Character) {
            this.opponentPlayer.character = newOpponentCharacter;
            this.opponentCharacter = newOpponentCharacter;
            this.mainContainer.addChild(newOpponentCharacter.animation);
        }
    }

    //removes current character and adds a new one on the stage
    //takes index of a new opponent's character data (required)
    public changeOpponentCharacterByIndex(opponentCharIndex: number): void {
        if (this.opponentPlayer && this.opponentPlayer.character && this.opponentPlayer.character.isCreated()) {
            this.mainContainer.removeChild(this.opponentPlayer.character.animation);
        }

        let charsList = Object.keys(gameData.charsData).map(key => gameData.charsData[key]);
        const opponentData = charsList[opponentCharIndex];
        const opponentCharacter = new Character({
            name: opponentData.name,
            resourceName: opponentData.resourceName,
            animationsList: opponentData.animationsList,
            x: 880,
            y: opponentData.name === "Blue" ? 1100 : opponentData.name === "Cat" || opponentData.name === "Corgi" ? 1130 : opponentData.name === "Mystery" ? 1290 : opponentData.name === "Zombie" ? 1120 : 1065,
            zOrder: 100
        });
        opponentCharacter.createAnimation();
        opponentCharacter.setAnimationByFullName(opponentCharacter.animationsList.idle_gameplay);
        this.changeOpponentCharacter(opponentCharacter);
    }

    protected addBackground(): void {

    }
    protected addLabels(): void {

    }
    protected addButtons(): void {

    }
}