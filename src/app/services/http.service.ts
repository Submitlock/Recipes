import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { RecipeModel } from '../models/recipe.model';
import { IngridientModel } from '../models/ingridient.model';

interface SuccessResponseRecipes { [name: string]: RecipeModel; }
interface SuccessResponseShopping { [name: string]: IngridientModel; }


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  fetchRecipes() {
    return this.http.get<SuccessResponseRecipes>('https://recipes-3bdfb.firebaseio.com/recipes.json')
          .pipe(
            catchError( this.handleHttpErrorResponse ),
            map( res => this.handleRecipeSuccessResponse(res) ),
          );
  }

  addRecipe(recipe: RecipeModel) {
     return this.http.post<{name: string}>(
            'https://recipes-3bdfb.firebaseio.com/recipes.json',
            recipe
          )
          .pipe(
            map( res => {
              recipe.id = res.name;
              return recipe;
            }),
            catchError( this.handleHttpErrorResponse )
          );
  }

  editRecipe(recipe: RecipeModel, id: string) {
    return this.http.put<RecipeModel>(
      'https://recipes-3bdfb.firebaseio.com/recipes/' + id + '.json',
      recipe
    )
    .pipe(
      map( () => {
        recipe.id = id;
        return recipe;
      }),
      catchError( this.handleHttpErrorResponse )
    );
  }

  deleteRecipe(id: string) {
    return this.http.delete<any>('https://recipes-3bdfb.firebaseio.com/recipes/' + id + '.json')
          .pipe(
            catchError( this.handleHttpErrorResponse )
          );
  }

  handleHttpErrorResponse(err: HttpErrorResponse) {
    return throwError('Error ocured');
  }

  // TRANSFORMS SUCCESS RECIPE RESPONSE IN RECIPE MODEL[]
  handleRecipeSuccessResponse(res: SuccessResponseRecipes): RecipeModel[] {
    const recipes: RecipeModel[] = [];
    if (res) {
      Object.keys(res).map(key => {
        const ingridients: IngridientModel[] = [];
        if (res[key].ingridients && res[key].ingridients.length > 0) {
          res[key].ingridients.map( (ingridient: {name: string, count: number}) =>
            ingridients.push( new IngridientModel(ingridient.name, ingridient.count) )
          );
        }
        const recipe = new RecipeModel(
          res[key].title,
          res[key].description,
          res[key].img,
          ingridients,
          res[key].user,
          key
        );
        recipes.push(recipe);
      });
    }
    return recipes;
  }

  // SHOPPING

  addToShoppingList(shoppingItem: IngridientModel) {
    return this.http.post<{name: string}>(
          'https://recipes-3bdfb.firebaseio.com/shopping.json',
          shoppingItem
          )
          .pipe(
            map( res => {
              shoppingItem.id = res.name;
              return shoppingItem;
            }),
            catchError( this.handleHttpErrorResponse )
          );
  }

  fetchShoppingList() {
    return this.http.get<SuccessResponseShopping>('https://recipes-3bdfb.firebaseio.com/shopping.json')
          .pipe(
            map( res => this.handleShoppingListSuccessResponse(res) ),
            catchError(this.handleHttpErrorResponse)
          );
  }

  updateShoppingItem(shoppingItem: IngridientModel) {
    return this.http.put<IngridientModel>(
            'https://recipes-3bdfb.firebaseio.com/shopping/' + shoppingItem.id + '.json',
            shoppingItem
          ).pipe(
            catchError( this.handleHttpErrorResponse )
          );
  }

  deleteShoppingItem(shoppingItem: IngridientModel) {
    return this.http.delete<any>('https://recipes-3bdfb.firebaseio.com/shopping/' + shoppingItem.id + '.json')
          .pipe(
            catchError( this.handleHttpErrorResponse )
          );
  }

  // TRANSFORMS SUCCESS SHOPPING INGRIDIENT RESPONSE IN INGRIDENT MODEL[]
  handleShoppingListSuccessResponse(res: any) {
    const shoppingList: IngridientModel[] = [];
    if (res) {
      Object.keys(res).map( key => {
        const item = new IngridientModel(res[key].name, res[key].count, key);
        shoppingList.push(item);
      });
    }
    return shoppingList;
  }

}
