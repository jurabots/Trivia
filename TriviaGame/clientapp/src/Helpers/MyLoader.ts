import {
    loaders, Texture, BaseTexture
} from 'pixi.js';

export default class MyLoader {
    private static loaders: loaders.Loader[] = [];

    public static get loader(): loaders.Loader {
        let loader: loaders.Loader = null;
        //trying to find free loader in pull
        for (let i = 0; i < MyLoader.loaders.length; i++) {
            if (!MyLoader.loaders[i].loading) {
                loader = MyLoader.loaders[i];
                break;
            }
        }
        //if free loader was not found, create a new one:
        if (!loader) {
            loader = new loaders.Loader();
            MyLoader.loaders.push(loader);
        }
        return loader;
    }

    public static async loadAssets(loader: loaders.Loader): Promise < object > {
        return new Promise((resolve, reject) => {
            loader.load(()=>{resolve();});
        });
    }

    public static getResource(name: string): loaders.Resource {
        let resource: loaders.Resource = null;
        for (let i = 0; i < MyLoader.loaders.length; i++) {
            if (MyLoader.loaders[i].resources[name]) {
                resource = MyLoader.loaders[i].resources[name];
                break;
            }
        }
        return resource;
    }

    public static checkResourceLoaded(key: string): boolean {
        let isLoaded: boolean = false;
        for (let i = 0; i < MyLoader.loaders.length; i++) {
            if (MyLoader.loaders[i].resources[key]) {
                isLoaded = true;
                break;
            }
        }
        return isLoaded;
    }

    public static async awaitLoadCompleted(loader: loaders.Loader): Promise<object>{
        return new Promise((resolve) => {
            if(loader.loading || loader.progress < 100)
                loader.onComplete.add(()=>{resolve();});
            else 
                resolve();
        });
    }

    public static async loadTexture(url: string): Promise < Texture > {
        return new Promise<Texture>((resolve) => {
            const img = new Image();
            img.crossOrigin = '';
            img.src = url;
            img.onload = () => {
                const base = new BaseTexture(img);
                resolve(new Texture(base));
            }
        });
    }
}