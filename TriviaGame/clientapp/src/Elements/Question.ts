/*
Trivia question object
Constructor takes an object with fields:
text - text of the question
answers - array of answers variants
rightAnswerIndex - index of the right answer in array
*/
export default class Question {
    text: string;
    answers : Array<string>;
    correctAnswerIndex : number;

    constructor(options) {
        this.text = options.text;
        this.answers = options.answers;
        this.correctAnswerIndex = options.correctAnswerIndex;
    }
}