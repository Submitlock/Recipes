import { ActivatedRoute } from '@angular/router';
import { RecipeService } from './../../../services/recipe.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeModel } from 'src/app/models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  constructor(private recipeService: RecipeService) { }

  loading = true;
  error: string;
  noRecipeMsg = false;
  recipes: RecipeModel[] = [];
  sub: any;

  ngOnInit() {
    this.initSetup();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initSetup() {
    // GET USERS IF IN SERVICE OR LOCALSTORAGE
    this.recipes = this.recipeService.getRecipes();
    if (this.recipes.length > 0) {
      this.loading = false;
    }
    // SUBSCRIBE FOR UPDATING VIA SUBJECT
    this.sub = this.recipeService.recipesUpdated.subscribe( recipes => {
      this.loading = false;
      this.recipes = recipes;
      if (recipes.length > 0) {
        this.noRecipeMsg = false;
      } else {
        this.noRecipeMsg = true;
      }
    });
    // MAKING HTTP REQUEST FOR FETCHING FROM DATABASE IF GETRECIPES RETURNS [],
    // UPDATE VIA SUBJECT
    if (this.recipes.length === 0) {
      this.recipeService.fetchRecipes().subscribe(
        () => {return; },
        err => {
          this.loading = false;
          this.error = err;
        }
      );
    }
  }
}
