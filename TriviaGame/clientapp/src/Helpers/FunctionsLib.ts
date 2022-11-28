import {
    Container,
    DisplayObject
} from 'pixi.js';

export default class FunctionsLib {

    //takes milliseconds of delay
    //returns awaitable Promise, that sets timeout
    static timeout(ms: number): Promise < object > {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //takes container instance and name of child to search
    //returns child instance
    static getContainerChildByName(container: Container, childName: string): DisplayObject {
        return container.children.find((sprite) => {
            return sprite.name === childName;
        });
    }

    //takes container instance and part of child's name
    //returns child instance
    static getContainerChildByNameContains(container: Container, childNamePart: string): DisplayObject {
        return container.children.find((sprite) => {
            return sprite.name.includes(childNamePart);
        });
    }


    //takes container instance and name of child to remove
    //returns true if child was removed and false if not
    static removeContainerChildByName(container: Container, childName: string): boolean {
        let result = false;
        let child = this.getContainerChildByName(container, childName);
        if (child !== null) {
            container.removeChild(child);
            result = true;
        }
        return result;
    }

    //takes container instance and part of child's name
    //returns true if child was removed and false if not
    static removeContainerChildByNameContains(container: Container, childNamePart: string): boolean {
        let result = false;
        let child = this.getContainerChildByNameContains(container, childNamePart);
        if (child !== null) {
            container.removeChild(child);
            result = true;
        }
        return result;
    }

    //takes container and two child's instances
    //removes first child from container
    //adds second child to container
    static changeContainerChild(container: Container, oldChild: DisplayObject, newChild: DisplayObject): void {
        container.removeChild(oldChild);
        container.addChild(newChild);
    }

    //changes order of elements in container according to their zOrder
    static sortContainerChildren(container): void {
        container.children.sort((a, b) => {
            return a.zOrder - b.zOrder;
        });
    }

    //takes array of all game elements and container instance
    //returns game element, that contains such a container
    static findGameElementByContainer(allElements, container: Container) {
        return allElements.find(element => {
            return (element.shapeContainer.name === container.name);
        });
    }

    //shuffles array randomly
    //takes array to shuffle
    //returns shuffled array
    static shuffleArray(array: Array < number > ): Array < number > {
        const arrLength: number = array.length;
        array.forEach((value: number, index: number) => {
            let newIndex: number = Math.floor(Math.random() * (arrLength - 1));
            let tmp: number = array[index];
            array[index] = array[newIndex];
            array[newIndex] = tmp;
        });
        return array;
    }

    //defines do arrays have common element(s)
    //takes two arrays
    //returns bool
    static haveCommonElements(arr1, arr2): boolean {
        return arr1.some(element => arr2.includes(element));
    }

    static shortUuid() {
        return 'xxxxxxyxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}