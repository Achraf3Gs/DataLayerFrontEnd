import { LocalStorageUser } from './../shared/intefaces/LocalStorageUser';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUserRegister } from '../shared/intefaces/IuserRegister';
import { TextInputComponent } from '../partial/input-text/input-text.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthUserService } from '../services/authuser.service';



@Component({
  selector: 'app-register-page',
  standalone: true,
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
  imports: [ReactiveFormsModule, RouterModule],
})
export class RegisterPageComponent implements OnInit {
  private authuserService = inject(AuthUserService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  registerForm: FormGroup = new FormGroup({
    name: new FormControl('',
      [Validators.required,
         Validators.minLength(5)]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  isSubmitted = false;
  returnUrl = '';
  fomUser: IUserRegister | undefined;

  ngOnInit(): void {}
  submit() {
    this.isSubmitted = true;
    if (this.registerForm.invalid) return;

    const fv = this.registerForm.value;
    this.fomUser = {
      name: fv.name,
      email: fv.email,
      password: fv.password,
      confirmPassword: fv.confirmPassword,
      address: fv.address,
      role: 'USER',
    };
    this.authuserService.register(this.fomUser) ;
    if(localStorage.getItem('LocalStorageUser'))
      this.router.navigateByUrl(this.returnUrl);
    };
  }

