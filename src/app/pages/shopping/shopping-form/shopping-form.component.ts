import { ShoppingService } from './../../../services/shopping.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IngridientModel } from 'src/app/models/ingridient.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shopping-form',
  templateUrl: './shopping-form.component.html',
  styleUrls: ['./shopping-form.component.css']
})
export class ShoppingFormComponent implements OnInit, OnDestroy {

  constructor(private shoppingService: ShoppingService) { }

  form: FormGroup;
  loading = false;
  loading2 = false;
  errorMsg: string;
  mode = 'create';
  selectedItem: IngridientModel;
  sub: any;

  ngOnInit() {
    this.initForm();

    // SUBSCRIBE ON SHOPPING ITEM SELECTED AND CHANGES THE MODE
    this.sub = this.shoppingService.shoppingItemSelected.subscribe(
                (shoppingItem: IngridientModel) => {
                  this.onEditMode(shoppingItem);
                }
              );

  }

  // SET THE VALUE TO THE SELECTED ITEM AND CHANGE THE MODE
  onEditMode(shoppingItem: IngridientModel) {
    this.selectedItem = shoppingItem;
    this.mode = 'edit';
    this.form.setValue({
      name: this.selectedItem.name,
      count: this.selectedItem.count
    });
  }

  initForm() {
    this.form = new FormGroup({
      name:  new FormControl(null, Validators.required),
      count: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    // COLLECT THE FORM INPUTS
    const name = this.form.value.name;
    const count = this.form.value.count;

    this.loading = true;

    // CREATE AN OBS TO BE SUBSCRIBED DEPENDING ON MODE
    let obs = new Observable();
    if (this.mode === 'create') {
      const shoppingItem = new IngridientModel(name, count);
      obs = this.shoppingService.addToShoppingList(shoppingItem);
    } else if (this.mode === 'edit') {
      this.selectedItem.name = name;
      this.selectedItem.count = count;
      obs = this.shoppingService.updateShoppingItem(this.selectedItem);
    }
    // CHECKES FOR ERRORS AND DISPLAY IF ANY
    obs.subscribe(
        () => {
          this.loading = false;
          this.backToCreateMode();
        },
        err => {
          this.loading = false;
          this.errorMsg = err;
          setTimeout( () => this.errorMsg = '' , 2000);
        }
    );

  }

  backToCreateMode() {
    this.mode = 'create';
    this.form.reset();
  }

  onDelete() {
    this.loading2 = true;
    this.shoppingService.deleteShoppingItem(this.selectedItem).subscribe(
      () => {
        this.loading2 = false;
        this.backToCreateMode();
      },
      err => {
        this.loading2 = true;
        this.errorMsg = err;
        setTimeout( () => this.errorMsg = '' , 2000);
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
