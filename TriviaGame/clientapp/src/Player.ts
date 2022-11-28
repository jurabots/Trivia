import Character from "./Elements/Character";

/*
Constructor of this class takes object with such fields:
name - player name, "player" is default value
accountSum - initial account sum for current player (1000 is default)
*/
export default class Player{
    private _name : string;
    private _color: string;
    private _isGameOrganizer: boolean;
    private _accountSum : number;
    private _character : Character;
    private avatarSource : string;

   
	public get name(): string {
		return this._name;
    }
    public set name(value: string) {
		this._name = value;
	}

    public get color(): string {
        return this._color;
    }
    public set color(value: string) {
        this._color = value;
    }

    public get isGameOrganizer(): boolean {
        return this._isGameOrganizer;
    }
    public set isGameOrganizer(value: boolean) {
        this._isGameOrganizer = value;
    }

	public get accountSum(): number {
		return this._accountSum;
    }
    public set accountSum(value: number) {
		this._accountSum = value;
	}

	public get character(): Character {
		return this._character;
	}
	public set character(value: Character) {
		this._character = value;
	}

    
    constructor(options) {
        this.name = (options === undefined || options.name === undefined) ? 
        "player" : options.name;
        this.accountSum = (options === undefined || options.accountSum === undefined) ?
        1000 : options.accountSum; 
        this.character = options.character;
        this.avatarSource = options.avatarSource;
    }

    //player pays bet for some action
    //takes bet sum (10 is default)
    //returns boolean: true if bet successfully paid, false if not
    public payBet(bet : number = 10) : boolean{
        let result : boolean = false;
        if(this.accountSum >= bet)
            {
                this.accountSum -= bet;
                result = true;
            }
        return result;
    }

    //player gets specified sum of coins on his account
    //takes sum of coins
    //returns void
    public getMoney(sum) : void{
        this.accountSum += sum;
    }
}