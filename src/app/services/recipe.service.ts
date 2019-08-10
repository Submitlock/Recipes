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

  fetchRecipes() {
    return this.httpService.fetchRecipes()
          .pipe(
            tap(res => {
              this.recipes = res;
              if (this.recipes.length > 0) {
                this.localStorageService.saveItem('recipes', this.recipes);
                this.recipesUpdated.next(this.recipes);
              }
            })
          );
  }

  addRecipe(recipe: RecipeModel) {
    return this.httpService.addRecipe(recipe)
          .pipe(
            tap(res => {
              this.recipes.push(recipe);
              this.localStorageService.saveItem('recipes', this.recipes);
              this.recipesUpdated.next(this.recipes);
            })
          );
  }

  editRecipe(recipe: RecipeModel, id: string) {
    return this.httpService.editRecipe(recipe, id)
          .pipe(
            tap(res => {
              const index = this.recipes.findIndex( singleRecipe => singleRecipe.id === id);
              this.recipes[index] = recipe;
              this.localStorageService.saveItem('recipes', this.recipes);
              this.recipesUpdated.next(this.recipes);
            })
          );
  }

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
      tap(res => {
        const index = this.recipes.findIndex( singleRecipe => singleRecipe.id === id);
        this.recipes.splice(index, 1);
        if (this.recipes.length > 0) {
          this.localStorageService.saveItem('recipes', this.recipes);
          this.recipesUpdated.next(this.recipes);
        } else {
          this.localStorageService.removeItem('recipes');
          this.recipesUpdated.next(this.recipes);
        }
      })
    );
  }

}
