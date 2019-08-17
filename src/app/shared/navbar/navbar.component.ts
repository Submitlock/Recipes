import { ActivatedRoute } from '@angular/router';
import { UserModel } from './../../models/user.model';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  user: UserModel;
  errorMsg: string;

  ngOnInit() {
    this.initSetup();
  }

  onLogOut(event: Event) {
    event.preventDefault();
    this.authService.logOut();
  }

  initSetup() {
    // GET USER AND SUBSCRIBE IF USER UPDATED
    this.user = this.authService.getUser();
    this.authService.userUpdate.subscribe( (user: UserModel) => this.user = user);
    // CHECK FOR PASSED ERRORS VIA QUERY PARAMS
    this.route.queryParams.subscribe( params => {
      if (params.error) {
        this.errorMsg = params.error;
        setTimeout( () => this.errorMsg = '' , 2000);
      }
    });
  }
}
