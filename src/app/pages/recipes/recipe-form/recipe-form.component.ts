import { UserModel } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { RecipeModel } from 'src/app/models/recipe.model';
import { IngridientModel } from 'src/app/models/ingridient.model';
import { RecipeService } from 'src/app/services/recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit {
  recipeForm: any;

  constructor(
    private authService: AuthService,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  @Input() mode: string;
  form: FormGroup;
  loading = false;
  recipe: RecipeModel;
  id: string;
  errorMsg: string;
  user: UserModel;

  ngOnInit() {
    this.initForm();
    this.initSetup();
  }

  initSetup() {
    // GET USER
    this.user = this.authService.getUser();
    // EDIT MODE -> LOOKS FOR RECIPE IN SERVICE AND LOCALSTROAGE
    // SETS THE FORM IF FOUND
    this.route.params.subscribe( params => {
      this.id = params.id;
      const selectRecipe = this.recipeService.getSingleRecipe(this.id);
      if (selectRecipe) {
        this.recipe = selectRecipe;
        this.setForm();
      }
    });
    // EDIT MODE -> IF NO RECIPE IS FOUND, HTTP REQUEST WILL BE MADE FROM RECIPELIST COMPONENT,
    // THAT MAKES HTTP REQUEST AND LOOKS FOR THE RECIPE IN THE DB, SETS THE FORM AFTER
    this.recipeService.recipesUpdated.subscribe( recipes => {
      const selectRecipe = this.recipeService.getSingleRecipe(this.id);
      if (selectRecipe) {
        this.recipe = selectRecipe;
        this.setForm();
      }
    });
  }


  initForm() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      img: new FormControl(null, Validators.required),
      ingridients: new FormArray([])
    });
  }

  getArray() {
    return (this.form.get('ingridients') as FormArray).controls;
  }

  onSubmit() {
    // CREATES RECIPEMODEL FROM THE FORM CONTROLS
    this.loading = true;
    const userEmail = this.user.email;
    const title = this.form.value.title;
    const description = this.form.value.description;
    const img = this.form.value.img;
    const ingridients: IngridientModel[] = [];
    this.getArray().map( control => ingridients.push(new IngridientModel(control.value.name, control.value.count)));
    const recipe = new RecipeModel(title, description, img, ingridients, userEmail);
    // SET OBSERVABLE TO BE SUBSCRIBED TO,
    // DEPENDING ON THE MODE AND HTTP REQUEST MADE
    let observable = new Observable();
    if (this.mode === 'new') {
      observable = this.recipeService.addRecipe(recipe);
    }
    if (this.mode === 'edit') {
      observable = this.recipeService.editRecipe(recipe, this.id);
    }
    observable.subscribe(
      (newRecipe: RecipeModel) => {
        this.loading = false;
        this.router.navigate(['/recipes', newRecipe.id]);
      },
      err => {
        this.errorMsg = err;
        this.loading = false;
      }
    );
  }

  // ADDING DYNAMICLY INGRIDIENT CONTROLS
  onAddIngridient(event: Event) {
    event.preventDefault();
    this.getArray().push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        count: new FormControl(null, Validators.required)
      })
    );
  }

  removeIngridient(index: number) {
    (this.form.get('ingridients') as FormArray).removeAt(index);
  }

  setForm() {
    this.form.patchValue({
      title: this.recipe.title,
      description: this.recipe.description,
      img: this.recipe.img
    });
    this.recipe.ingridients.map( ingridient => {
      this.getArray().push(
        new FormGroup({
          name: new FormControl(ingridient.name, Validators.required),
          count: new FormControl(ingridient.count, Validators.required)
        })
      );
    });
  }

}
