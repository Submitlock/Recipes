import { ShoppingService } from './../../../services/shopping.service';
import { AuthService } from './../../../services/auth.service';
import { UserModel } from './../../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe.service';
import { RecipeModel } from 'src/app/models/recipe.model';

@Component({
  selector: 'app-view-recipe',
  templateUrl: './view-recipe.component.html',
  styleUrls: ['./view-recipe.component.css']
})
export class ViewRecipeComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router,
    private shoppingService: ShoppingService
  ) { }

  id: string;
  recipe: RecipeModel;
  user: UserModel;
  errorMsg: string;
  loading = false;
  loading2 = false;

  ngOnInit() {
    this.initSetup();
  }

  deleteRecipe() {
    this.loading = true;
    this.recipeService.deleteRecipe(this.id).subscribe(
      () => this.router.navigate(['/recipes']),
      err => {
        this.loading = false;
        this.errorMsg = err;
      }
    );
  }

  // PUSHES INGRIDIENTS TO SHOPPING LIST
  pushToShoppingList() {
    this.loading2 = true;
    this.shoppingService.pushShoppingItemFromRecipe(this.recipe.ingridients);
  }

  initSetup() {
    // GET USER
    this.user = this.authService.getUser();
    // SUBSCRIBE TO PARAMS ID AND LOOK FOR IT IN SERVICE AND LOCALSTORAGE
    this.route.params.subscribe( params => {
      this.id = params.id;
      const selectRecipe = this.recipeService.getSingleRecipe(this.id);
      if (selectRecipe) {
        this.recipe = selectRecipe;
      }
    });
    // IF NO RECIPE IS FOUND, HTTP REQUEST WILL BE MADE FROM RECIPELIST COMPONENT
    // AND LOOKS FOR THE RECIPE IN THE DB
    this.recipeService.recipesUpdated.subscribe( recipes => {
      const selectRecipe = this.recipeService.getSingleRecipe(this.id);
      if (selectRecipe) {
        this.recipe = selectRecipe;
      }
    });

  }

}
