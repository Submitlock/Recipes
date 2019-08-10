import { ViewRecipeComponent } from './pages/recipes/view-recipe/view-recipe.component';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { NgModule } from '@angular/core';
import { NewRecipeComponent } from './pages/recipes/new-recipe/new-recipe.component';
import { EditRecipeComponent } from './pages/recipes/edit-recipe/edit-recipe.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'recipes', component: RecipesComponent,
        children: [
            {path: 'new', component: NewRecipeComponent},
            {path: ':id', component: ViewRecipeComponent},
            {path: ':id/edit', component: EditRecipeComponent},
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRouting { }

