import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RecipeService } from './recipe.service';
import { RecipeModel } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class CheckRecipeService {

  constructor(
    private router: Router,
    private recipeService: RecipeService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const recipes: RecipeModel[] = this.recipeService.getRecipes();
    const id: string = route.params.id;
    const recipe: RecipeModel = this.recipeService.getSingleRecipe(id);

    // MAKES A CHECK IF SELECTED RECIPE IN SERVICE OR LOCALSTORAGE
    // REDIRECTS WITH QUERY PARAMS ERROR IF NOT FOUND
    if (recipes.length > 0) {
      if (recipe) {
        return true;
      }
      this.router.navigate([''], {queryParams: { error: 'No Recipe Found!'}});
      return false;
    }

    // MAKES FIREBASE REQUEST
    // IF NO RECIPE FOUND IN SERVICE OR LOCALSTORAGE
    // REDIRECTS WITH QUERY PARAMS ERROR IF NOT FOUND
    this.recipeService.fetchRecipes().subscribe( (fetchedRecipes: RecipeModel[]) => {
      const arrIndex: number = fetchedRecipes.findIndex( singleRecipe => singleRecipe.id === id);
      if (arrIndex > -1) {
        return true;
      }
      this.router.navigate([''], {queryParams: { error: 'No Recipe Found!'}});
      return false;
    });

  }
}
