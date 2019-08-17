import { LocalStorageService } from './local-storage.service';
import { HttpService } from './http.service';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { IngridientModel } from '../models/ingridient.model';
import { tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  constructor(private httpService: HttpService,
              private localStorageService: LocalStorageService,
              private router: Router,
              private route: ActivatedRoute
            ) { }

  private shoppingList: IngridientModel[] = [];
  shoppingListUpdated = new Subject<IngridientModel[]>();
  shoppingItemSelected = new Subject<IngridientModel>();

  // GETS SHOPPING LIST FROM SERVICE OR LOCALSTORAGE
  getShoppingList() {
    const storageShoppingList = this.localStorageService.getItem('shoppingList');
    if (this.shoppingList.length > 0) {
      return this.shoppingList.slice();
    }
    if (storageShoppingList.length > 0) {
      this.shoppingList = storageShoppingList;
      return storageShoppingList;
    }
    return this.shoppingList.slice();
  }

  // CALLING GET REQUEST FROM HTTP SERVICE
  // AND UPDATES WITH SUBJECT
  fetchShoppingList() {
    return this.httpService.fetchShoppingList().pipe(
            tap( (shoppingList: IngridientModel[]) => {
              if (shoppingList.length > 0) {
                this.shoppingList = shoppingList;
                this.localStorageService.saveItem('shoppingList', this.shoppingList);
              }
              this.shoppingListUpdated.next(this.shoppingList.slice());
            })
          );
  }

  // CALLING POST REQUEST FROM HTTP SERVICE
  // AND UPDATES WITH SUBJECT
  addToShoppingList(shoppingItem: IngridientModel) {
    return this.httpService.addToShoppingList(shoppingItem)
          .pipe(
            tap( (item: IngridientModel) => {
              this.shoppingList.push(item);
              this.shoppingListUpdated.next(this.shoppingList.slice());
              this.localStorageService.saveItem('shoppingList', this.shoppingList);
            })
          );
  }

  // CALLING PUT REQUEST FROM HTTP SERVICE
  // AND UPDATES WITH SUBJECT
  updateShoppingItem(shoppingItem: IngridientModel) {
    return this.httpService.updateShoppingItem(shoppingItem)
          .pipe(
            tap( res => {
              const index = this.shoppingList.findIndex( item =>  item.id === shoppingItem.id);
              this.shoppingList[index] = shoppingItem;
              this.shoppingListUpdated.next(this.shoppingList.slice());
              this.localStorageService.saveItem('shoppingList', this.shoppingList);
            })
          );
  }

  deleteShoppingItem(shoppingItem: IngridientModel) {
    return this.httpService.deleteShoppingItem(shoppingItem)
          .pipe(
            tap( () => {
              const index = this.shoppingList.findIndex( item =>  item.id === shoppingItem.id);
              this.shoppingList.splice(index, 1);
              this.localStorageService.saveItem('shoppingList', this.shoppingList);
              this.shoppingListUpdated.next(this.shoppingList.slice());
            })
          );
  }

  // PUSHING INGRIDIENTS FROM VIEW RECIPE COMPONENT
  pushShoppingItemFromRecipe(ingridients: IngridientModel[]) {
    ingridients.map( ingridient => {
      this.addToShoppingList(ingridient).subscribe(
        () => this.router.navigate(['/shopping']),
        err => {
          this.router.navigate(['/shopping'], { queryParams: { error: err }});
        }
      );
    });
  }

}
