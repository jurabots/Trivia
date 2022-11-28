import Question from '../Elements/Question';

export default class DataSource {

    private static _currentQuestion:Question;
   
    static async getAllTopics() {
        //AJAX request goes here...
        return ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5",
            "Topic 6", "Topic 7", "Topic 8", "Topic 9", "Topic 10",
            "Topic 11", "Topic 12", "Topic 13", "Topic 14", "Topic 15",
            "Topic 16", "Topic 17", "Topic 18", "Topic 19", "Topic 20"
        ];
    }

    public static get currentQuestion(): Question {
		return this._currentQuestion;
	}

	public static set currentQuestion(value: Question) {
		this._currentQuestion = value;
    }
    
    //takes index of selected topic 
    //returns Question object
    static async getQuestion(topicIndex: number) : Promise<Question> {
        //AJAX request goes here...
        this.currentQuestion = new Question({
            text: "This is a very difficult question from the list for topic " + (topicIndex + 1),
            answers: ["answer 1", "answer 2", "answer 3", "correct answer 4"],
            correctAnswerIndex: 3
        });
        return this.currentQuestion;
    }

    static async getOpponentAnswer() : Promise<number> {
        //AJAX request goes here...
        //return 3; //opponent wins
        const opponentAnswer: number = (+ new URLSearchParams(window.location.search).get("opponentAnswer") - 1);
        return opponentAnswer < 4 && opponentAnswer >= 0 ? opponentAnswer : 0; 
    }

    static async sendOpponentState(isWin: boolean) : Promise<void>{
        //AJAX request goes here...
    }
    
}