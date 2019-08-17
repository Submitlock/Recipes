import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { UserModel } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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
    // GET USER AND UPDATE IF CHANGED
    this.user = this.authService.getUser();
    this.authService.userUpdate.subscribe( (user: UserModel) => this.user = user);
    // CHECK FOR ERRORS IN ROUTE.DATA IF NO PAGE FOUND AND REDIRECTED HERE
    const msg = this.route.snapshot.data.msg;
    if (msg) {
      this.errorMsg = msg;
      setTimeout( () => this.errorMsg = '' , 2000);
    }
  }

}
