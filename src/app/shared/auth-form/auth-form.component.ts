import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  isLoginMode = true;
  errorMsg: string;
  loading = false;

  ngOnInit() {
  }


  onSubmit(form: NgForm) {
    let authObservable = new Observable();
    this.loading = true;
    // DECLARE FORM INPUTS
    const email = form.value.email;
    const password = form.value.password;
    // SUBMIT DEPENDING ON THE MODE
    if (this.isLoginMode) {
      authObservable = this.authService.logIn(email, password);
    } else {
      authObservable = this.authService.register(email, password);
    }
    authObservable.subscribe(
      () => this.router.navigate(['/recipes']),
      err => {
        this.errorMsg = err;
        this.loading = false;
      }
    );
  }
}
