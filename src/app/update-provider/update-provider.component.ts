import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProviderService } from '../services/provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs';
import { Provider } from '../model/Provider';
import { ProviderNavBarComponent } from '../provider-nav-bar/provider-nav-bar.component';

@Component({
  selector: 'app-update-provider',
  standalone: true,
  imports: [FormsModule, ProviderNavBarComponent],
  templateUrl: './update-provider.component.html',
  styleUrls: ['./update-provider.component.css'],
})
export class UpdateProviderComponent implements OnInit {
  providerService = inject(ProviderService);
  router = inject(Router);
  activateRoute = inject(ActivatedRoute);

  id: any;
  providerToUpdate: Provider | undefined;
  name: string = '';
  email: string = '';
  address: string = '';

  ngOnInit() {
    this.id = this.activateRoute.snapshot.paramMap.get('id');
    this.providerService
      .getProvider(this.id)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((response: Provider) => {
        this.providerToUpdate = response;
        console.log(this.providerToUpdate);
        this.name = response.name;
        this.email = response.email;
        this.address = response.address;
      });
  }

  updateProvider() {
    this.providerToUpdate = {
      id: this.id,
      name: this.name,
      email: this.email,
      address: this.address,
    };
    this.providerService
      .updateProvider(this.providerToUpdate)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['listProvider']);
      });
  }
}
