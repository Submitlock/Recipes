import { RecipeModel } from 'src/app/models/recipe.model';
import { UserModel } from './../models/user.model';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root'
})
export class EditRouteProtectionService implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private recipeService: RecipeService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const user: UserModel = this.authService.getUser();
    const recipeId: string = route.params.id;
    const recipes: RecipeModel[] = this.recipeService.getRecipes();

    // LOOKS IN SERVICE AND LOCAL STORAGE
    // CHECKS IF RECIPE LOADED AND LOGGED IN USER MATCH
    if (recipes.length > 0) {
      const recipeIndex: number = recipes.findIndex( item => item.id === recipeId);
      if (recipes[recipeIndex].user === user.email) {
        return true;
      }
      this.router.navigate([''], {queryParams: { error: 'Not allowed!'}});
      return false;
    }
    // MAKES HTTP REQUEST TO FIREBASE TO FETCH RECIPES
    this.recipeService.fetchRecipes().subscribe( (fetchedRecipes: RecipeModel[]) => {
      const recipeIndex: number = fetchedRecipes.findIndex( item => item.id === recipeId);
      if (recipeIndex > -1 && fetchedRecipes[recipeIndex].user === user.email) {
        return true;
      }
      this.router.navigate([''], {queryParams: { error: 'Not allowed!'}});
      return false;
    });
  }

}
