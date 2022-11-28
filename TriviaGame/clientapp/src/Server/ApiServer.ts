import {
    gameSettings
} from "../Helpers/GameSettings";
import { IQuestion } from "./Models";

interface IApiCallResult{
    isSuccess: boolean,
    data: any
}

export default class ApiServer {
    private static _instance: ApiServer = null;
    private apiUrl: string = gameSettings.serverUrl + "/api";
    private endpoints = gameSettings.apiEndpoints;

    private constructor() {}

    public static get instance(): ApiServer {
        if (!ApiServer._instance) {
            ApiServer._instance = new ApiServer();
        }
        return ApiServer._instance;
    }

    private async getData(url: string): Promise < IApiCallResult > {
        return await new Promise < IApiCallResult > ((resolve) => {
            const result = {
                isSuccess: false,
                data: null
            };
            let xhttp = new XMLHttpRequest();
            xhttp.open("GET", url, true);
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4) {
                    if (xhttp.status == 200) {
                        const data = JSON.parse(xhttp.responseText);
                        if (data.error) {
                            resolve(result);
                        } else {
                            result.isSuccess = true;
                            result.data = data;
                            resolve(result);
                        }
                    } else {
                        console.log('[server]: a problem with request');
                        resolve(result);
                    }
                }
            };
            xhttp.send();
        });
    }


    public async getCategories(): Promise < any[] > {
        let categories = [];
        let url = `${this.apiUrl}/${this.endpoints.categories}`;
        const callResult = await this.getData(url);
        if (callResult.isSuccess){
            categories = callResult.data;
        }
        return categories;
    }

    public async getQuestion(categoryId: number): Promise<IQuestion> {
        let question:IQuestion = null;
        let url = `${this.apiUrl}/${this.endpoints.question}/${categoryId}`;
        const callResult = await this.getData(url);
        if (callResult.isSuccess){
            question = {
                id: callResult.data.id,
                text: callResult.data.text,
                answers: callResult.data.answers
            };
        }
        return question;
    }

    public async getLeaders(daysPeriod = 30): Promise < any[] > {
        let leaders = [];
        let url = `${this.apiUrl}/${this.endpoints.leaders}/${daysPeriod}`;
        const callResult = await this.getData(url);
        if (callResult.isSuccess){
            leaders = callResult.data;
        }
        return leaders;
    }
}