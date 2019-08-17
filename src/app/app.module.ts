import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRouting } from './app-navigation';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthFormComponent } from './shared/auth-form/auth-form.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { AlertComponent } from './shared/alert/alert.component';
import { NewRecipeComponent } from './pages/recipes/new-recipe/new-recipe.component';
import { EditRecipeComponent } from './pages/recipes/edit-recipe/edit-recipe.component';
import { RecipeListComponent } from './pages/recipes/recipe-list/recipe-list.component';
import { RecipeFormComponent } from './pages/recipes/recipe-form/recipe-form.component';
import { ViewRecipeComponent } from './pages/recipes/view-recipe/view-recipe.component';
import { BtnLoaderComponent } from './shared/btn-loader/btn-loader.component';
import { ShoppingComponent } from './pages/shopping/shopping.component';
import { ShoppingFormComponent } from './pages/shopping/shopping-form/shopping-form.component';
import { ShoppingListComponent } from './pages/shopping/shopping-list/shopping-list.component';
import { InterceptorService } from './services/interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RecipesComponent,
    NavbarComponent,
    AuthFormComponent,
    LoaderComponent,
    AlertComponent,
    NewRecipeComponent,
    EditRecipeComponent,
    RecipeListComponent,
    RecipeFormComponent,
    ViewRecipeComponent,
    BtnLoaderComponent,
    ShoppingComponent,
    ShoppingFormComponent,
    ShoppingListComponent,
  ],
  imports: [
    BrowserModule,
    AppRouting,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
