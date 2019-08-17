import { LocalStorageService } from './local-storage.service';
import { HttpService } from './http.service';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { RecipeModel } from '../models/recipe.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private recipes: RecipeModel[] = [];
  recipesUpdated = new Subject<RecipeModel[]>();

  constructor(private httpService: HttpService, private localStorageService: LocalStorageService) { }

  // GETS RECIPE FROM SERVICE OR LOCALSTORAGE
  getRecipes(): RecipeModel[] {
    const storageRecipes = this.localStorageService.getItem('recipes');
    if (this.recipes.length > 0) {
      return this.recipes.slice();
    }
    if (storageRecipes.length > 0) {
      this.recipes = storageRecipes;
      return storageRecipes;
    }
    return this.recipes.slice();
  }

  // CALLING GET REQUEST FROM HTTP SERVICE
  // AND UPDATES WITH SUBJECT
  fetchRecipes() {
    return this.httpService.fetchRecipes()
          .pipe(
            tap(res => {
              if (res.length > 0) {
                this.recipes = res;
                this.localStorageService.saveItem('recipes', this.recipes);
              }
              this.recipesUpdated.next(this.recipes);
            })
          );
  }

  // CALLING POST REQUEST FROM HTTP SERVICE
  // AND UPDATES WITH SUBJECT
  addRecipe(recipe: RecipeModel) {
    return this.httpService.addRecipe(recipe)
          .pipe(
            tap( () => {
              this.recipes.push(recipe);
              this.localStorageService.saveItem('recipes', this.recipes);
              this.recipesUpdated.next(this.recipes);
            })
          );
  }

   // CALLING PUT REQUEST FROM HTTP SERVICE
  // AND UPDATES WITH SUBJECT
  editRecipe(recipe: RecipeModel, id: string) {
    return this.httpService.editRecipe(recipe, id)
          .pipe(
            tap( () => {
              const index = this.recipes.findIndex( singleRecipe => singleRecipe.id === id);
              this.recipes[index] = recipe;
              this.localStorageService.saveItem('recipes', this.recipes);
              this.recipesUpdated.next(this.recipes);
            })
          );
  }

  // GETS SINGLE RECIPE OR RETURNS NULL IF NOT FOUND
  getSingleRecipe(id: string): RecipeModel | null {
     const index = this.recipes.findIndex( recipe => recipe.id === id);
     if (index === -1) {
       return null;
     }
     return this.getRecipes()[index];
  }

  deleteRecipe(id: string) {
    return this.httpService.deleteRecipe(id)
    .pipe(
      tap( () => {
        const index = this.recipes.findIndex( singleRecipe => singleRecipe.id === id);
        this.recipes.splice(index, 1);
        this.localStorageService.saveItem('recipes', this.recipes);
        this.recipesUpdated.next(this.recipes);
      })
    );
  }

}
