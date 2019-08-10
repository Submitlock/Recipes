import { UserModel } from './../../models/user.model';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

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
