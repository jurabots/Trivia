export interface IQuestion {
    id: number;
    text: string;
    answers: IAnswer[];
}

export interface IAnswer {
    id: number, 
    text: string, 
    isCorrect: boolean
}