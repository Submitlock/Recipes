import { AuthService } from './../../services/auth.service';
import { UserModel } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService) { }

  user: UserModel;

  ngOnInit() {
    this.user = this.authService.getUser();
    this.authService.userUpdate.subscribe( (user: UserModel) => this.user = user);
  }

  onLogOut(event: Event) {
    event.preventDefault();
    this.authService.logOut();
  }

}
