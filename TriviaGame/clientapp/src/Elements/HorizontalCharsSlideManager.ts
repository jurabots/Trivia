import HorizontalSlideManager from "./HorizontalSlideManager";
import { Container, Sprite } from "pixi.js";

export default class HorizontalCharsSlideManager extends HorizontalSlideManager{
    constructor(options){
        super(options);
    }

    protected prepareAllSlides() : Array<Container|Sprite> {
        const allSlides : Array<Container> = [];
        //creating containers for each slide and store them into array
        let elementsCounter : number = 0;
        for (let s = 0; s < this.slidesTotal; s++) { //each slide loop
            const container = new Container();
            container.width = this.width;
            container.height = this.height;
            container.x = 0;
            container.y = 0;
            let nextY = this.marginTop;
            let globalX = this.marginLeft;

            for (let i = 0; i < this.nVertical; i++) { //rows loop
                let maxHeight = 0;
                let nextX = globalX;
                for (let j = 0; j < this.nHorizontal && elementsCounter < this.elements.length; j++) { //columns loop
                    const element = this.elements[elementsCounter];
                    console.log("Slider char height: " + element.height);
                    
                    maxHeight = element.height > maxHeight ? element.height : maxHeight;
                    element.y = element.name === "Blue" ? 995 :
                        element.name === "Cat" || element.name === "Corgi" ? 1030 :
                        element.name === "Zombie" ? 1025 : 970;
                    element.x = nextX;
                    nextX += element.width + this.spaceHorizontal;
                    container.addChild(element);
                    elementsCounter++;
                }
                nextY += maxHeight + this.spaceVertical;
            }
            allSlides.push(container);
        }
        return allSlides;
    }

}