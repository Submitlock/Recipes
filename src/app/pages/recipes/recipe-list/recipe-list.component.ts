import { RecipeService } from './../../../services/recipe.service';
import { Component, OnInit } from '@angular/core';
import { RecipeModel } from 'src/app/models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  constructor(private recipeService: RecipeService) { }

  loading = true;
  error: string;
  noRecipeMsg = false;
  recipes: RecipeModel[] = [];

  ngOnInit() {
    this.recipes = this.recipeService.getRecipes();
    if (this.recipes.length > 0) {
      this.loading = false;
    }
    this.recipeService.recipesUpdated.subscribe( recipes => {
      this.recipes = recipes;
      if (this.recipes.length > 0) {
        this.noRecipeMsg = false;
      } else {
        this.noRecipeMsg = true;
      }
    });

    if (this.recipes.length === 0) {
      this.recipeService.fetchRecipes().subscribe(
        (recipes: RecipeModel[]) => {
          this.loading = false;
          if (recipes.length === 0) {
            this.noRecipeMsg = true;
          }
        },
        err => {
          this.loading = false;
          this.error = err;
        }
      );
    }

  }

}
