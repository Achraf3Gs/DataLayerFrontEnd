import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProviderService } from '../services/provider.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { ProviderNavBarComponent } from "../provider-nav-bar/provider-nav-bar.component";

@Component({
  selector: 'app-add-provider',
  standalone: true,
  imports: [FormsModule, ProviderNavBarComponent],
  templateUrl: './add-provider.component.html',
  styleUrl: './add-provider.component.css',
})
export class AddProviderComponent {
  providerService = inject(ProviderService);
  router = inject(Router);

  provider: any;

  createProvider(myform: any) {
    this.providerService
      .createProvider(myform)
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
