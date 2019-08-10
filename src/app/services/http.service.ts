import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { RecipeModel } from '../models/recipe.model';
import { IngridientModel } from '../models/ingridient.model';
import { stringify } from 'querystring';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  fetchRecipes() {
    return this.http.get('https://recipes-3bdfb.firebaseio.com/recipes.json')
          .pipe(
            catchError( this.handleHttpErrorResponse ),
            map( res => this.handleHttpSuccessResponse(res) ),
          );
  }

  addRecipe(recipe: RecipeModel) {
     return this.http.post<any>(
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
    return this.http.put<any>(
      'https://recipes-3bdfb.firebaseio.com/recipes/' + id + '.json',
      recipe
    )
    .pipe(
      map( res => {
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
    console.log(err);
    return throwError('Error ocured');
  }
  handleHttpSuccessResponse(res: any) {
    const recipes: RecipeModel[] = [];
    if (res) {
      Object.keys(res).map(key => {
        const ingridients: IngridientModel[] = [];
        if (res[key].ingridients.length > 0) {
          res[key].ingridients.map( (ingridient: {name: string, count: number}) =>
            ingridients.push( new IngridientModel(ingridient.name, ingridient.count) )
          );
        }
        const recipe = new RecipeModel(
          res[key].title,
          res[key].description,
          res[key].img,
          ingridients,
          this.authService.getUser().email,
          key
        );
        recipes.push(recipe);
      });
    }
    return recipes;
  }
}
