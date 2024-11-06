import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUserService } from '../services/authuser.service';
import { IUserLogin } from '../shared/intefaces/IUserLogin';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  userLogin: IUserLogin = {
    email: '',
    password: '',
  };

  http = inject(HttpClient);
  router = inject(Router);
  authuserService = inject(AuthUserService);


  onlogin() {
    console.log('user to log in login', this.userLogin);
    this.authuserService.login(this.userLogin);

  }
}
