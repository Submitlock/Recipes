import { ShoppingService } from './../../../services/shopping.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IngridientModel } from 'src/app/models/ingridient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  constructor(private shoppingService: ShoppingService) { }

  shoppingList: IngridientModel[] = [];
  loading = true;
  errorMsg: string;
  noItemsMsg = false;
  sub: any;

  ngOnInit() {
    this.initSetup();
  }

  initSetup() {
    // LOOK FOR SHOPPING LIST IN SERVICE AND LOCALSTORAGE
    this.shoppingList = this.shoppingService.getShoppingList();
    if (this.shoppingList.length > 0) {
      this.loading = false;
    }
    // SUBSCRIBE FOR SHOPPING LIST CHANGES
    // ALSO IF NO SHOPPING ITEMS FOUND WILL MAKE A HTTP REQUEST TO FETCH LIST
    // AND WILL UPDATE LIST VIA SUBJECT
    this.sub = this.shoppingService.shoppingListUpdated.subscribe( (shoppingList: IngridientModel[]) => {
      this.loading = false;
      this.shoppingList = shoppingList;
      if (shoppingList.length > 0) {
        this.noItemsMsg = false;
      } else {
        this.noItemsMsg = true;
      }
    });

    // IF NO SHOPPING LIST FOUND IN SERVICE AND LOCALSTORAGE
    // WILL MAKE AN HTTP REQUEST TO FETCH LIST AND UPDATE COMPONENT
    // VIA SUBJECT
    if (this.shoppingList.length === 0) {
      this.shoppingService.fetchShoppingList().subscribe(
        () => {return; },
        err => this.errorMsg = err
      );
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // FIRE NEXT() ON SUBJECT WHEN ITEM SELECTED TO UPDATE
  // SHOPPING FORM
  onSelect(event: any, shoppingItem: IngridientModel) {
    event.preventDefault();
    if (event.target.localName !== 'button') {
      this.shoppingService.shoppingItemSelected.next(shoppingItem);
    }
  }

}
