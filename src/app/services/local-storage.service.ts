import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { RecipeModel } from '../models/recipe.model';
import { IngridientModel } from '../models/ingridient.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  saveItem(name: string, item: any) {
    localStorage.setItem(name, JSON.stringify(item));
  }

  getItem(name: string): any {
    const localStorageItem = JSON.parse(localStorage.getItem(name));
    if (name === 'user') {
      if (localStorageItem) {
        return this.convertItemToUserModel(localStorageItem);
      }
      return null;
    } else if (name === 'recipes') {
      if (localStorageItem) {
        return this.convertItemToRecipeModel(localStorageItem);
      }
      const emptyRecieps: RecipeModel[] = [];
      return emptyRecieps;
    }
  }

  removeItem(name: string) {
    localStorage.removeItem(name);
  }

  convertItemToUserModel(item: any) {
      const expires: Date = new Date(item.expires);
      const user: UserModel = new UserModel(item.email, item.token, expires);
      // CHECK OF TOKEN VALIDITY
      if (expires > new Date()) {
        return user;
      } else {
        this.removeItem(name);
        return null;
      }
  }

  convertItemToRecipeModel(item: any) {
    const recipes: RecipeModel[] = [];
    item.map( (singleItem: RecipeModel) => {
      const ingridients: IngridientModel[] = [];
      if (singleItem.ingridients.length > 0) {
        singleItem.ingridients.map( ingridient =>
          ingridients.push(new IngridientModel(ingridient.name, ingridient.count)
        ));
      }
      const recipe = new RecipeModel(
        singleItem.title,
        singleItem.description,
        singleItem.img,
        ingridients,
        singleItem.user,
        singleItem.id
      );
      recipes.push(recipe);
    });
    return recipes;
  }

}
