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
    private router: Router
  ) { }

  id: string;
  recipe: RecipeModel;
  user: UserModel;
  errorMsg: string;
  loading = false;

  ngOnInit() {
    this.user = this.authService.getUser();
    this.route.params.subscribe( params => {
      this.id = params.id;
      const selectRecipe = this.recipeService.getSingleRecipe(this.id);
      if (selectRecipe) {
        this.recipe = selectRecipe;
      }
    });
    this.recipeService.recipesUpdated.subscribe( recipes => {
      const selectRecipe = this.recipeService.getSingleRecipe(this.id);
      if (selectRecipe) {
        this.recipe = selectRecipe;
      }
    });
  }

  deleteRecipe() {
    this.loading = true;
    this.recipeService.deleteRecipe(this.id).subscribe(
      res => {
        this.router.navigate(['/recipes']);
      },
      err => {
        this.loading = false;
        this.errorMsg = err;
      }
    );
  }

}
