import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { RecipeModel } from '../models/recipe.model';
import { IngridientModel } from '../models/ingridient.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // SAVING ITEM TO LOCAL STORAGE WITH DYNAMIC PARAMETЕR
  saveItem(name: string, item: any): void {
    if (name !== 'user' && item.length === 0) {
      this.removeItem(name);
      return;
    }
    localStorage.setItem(name, JSON.stringify(item));
  }

  // GETTING ITEM WITH DYNAMIC PARAMETER
  // AND CALLS A FUNCTION TO TRANSFORM IT IN THE CORRECT FORMAT
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
    } else if (name === 'shoppingList') {
      return this.convertItemToShoppingList(localStorageItem);
    }
  }

  // CLEARS ITEM WITH DYNAMIC PARAMETER
  removeItem(name: string) {
    localStorage.removeItem(name);
  }

  // CONVERTING ITEM IN USER MODEL
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
  // CONVERTING ITEM IN RECIPE MODEL
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

  // CONVERTING ITEM IN INGRIDIENT MODEL
  convertItemToShoppingList(storageItem: any) {
    const shoppingList: IngridientModel[] = [];
    if (storageItem) {
      storageItem.map( (item: any) => shoppingList.push(new IngridientModel(item.name, item.count, item.id)));
    }
    return shoppingList;
  }

}
