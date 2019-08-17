import { EditRouteProtectionService } from './services/edit-route-protection.service';
import { ShoppingComponent } from './pages/shopping/shopping.component';
import { ViewRecipeComponent } from './pages/recipes/view-recipe/view-recipe.component';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { NgModule } from '@angular/core';
import { NewRecipeComponent } from './pages/recipes/new-recipe/new-recipe.component';
import { EditRecipeComponent } from './pages/recipes/edit-recipe/edit-recipe.component';
import { RouteProtectionService } from './services/route-protection.service';
import { CheckRecipeService } from './services/check-recipe.service';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'recipes', component: RecipesComponent, canActivate: [RouteProtectionService],
        children: [
            {path: 'new', component: NewRecipeComponent},
            {path: ':id', component: ViewRecipeComponent, canActivate: [CheckRecipeService]},
            {path: ':id/edit', component: EditRecipeComponent, canActivate: [EditRouteProtectionService]},
        ]
    },
    { path: 'shopping', component: ShoppingComponent, canActivate: [RouteProtectionService] },
    { path: '**', redirectTo: '', data: { msg: 'Page not found' } }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRouting { }

