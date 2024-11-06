import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ProviderService } from '../services/provider.service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';
import { ProviderNavBarComponent } from '../provider-nav-bar/provider-nav-bar.component';


@Component({
  selector: 'app-list-provider',
  standalone: true,
  imports: [NgFor,ProviderNavBarComponent],
  templateUrl: './list-provider.component.html',
  styleUrl: './list-provider.component.css',
})
export class ListProviderComponent implements OnInit {
  providers: any;

  providerService = inject(ProviderService);
  router= inject(Router);

  ngOnInit(): void {
    this.providerService.listProvider().subscribe((response) => {
      this.providers = response;
    });
  }
  deleteProvider(id: any) {
    this.providerService.deleteProvider(id)
 .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
       .subscribe((response) => {
      console.log(response);
      this.refrechListProviders();
    });
  }

  refrechListProviders() {
    this.providerService
      .listProvider()
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((response) => {
        this.providers = response;
      });
  }

  updateProvider(myObj: any) {
    this.router.navigate(['updateProvider'+ '/'+ myObj['id']])
}

}
