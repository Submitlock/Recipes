import { IngridientModel } from './ingridient.model';

export class RecipeModel {
    constructor(
        public title: string,
        public description: string,
        public img: string,
        public ingridients: IngridientModel[],
        public user: string,
        public id?: string
    ) {}
}
