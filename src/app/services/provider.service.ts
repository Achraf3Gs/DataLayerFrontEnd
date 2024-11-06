import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Provider } from '../model/Provider';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  urlProviders = environment.urlProviders;
  provider: any;

  http = inject(HttpClient);
  
  listProvider() {
    return this.http.get(this.urlProviders + '/list');
  }

  createProvider(myform: any) {
    this.provider = {
      name: myform.value.providerName,
      email: myform.value.providerEmail,
      address: myform.value.providerAddress,
    };
    console.log(this.provider);
    return this.http.post(this.urlProviders + '/add', this.provider);
  }

  updateProvider(provider: Provider): Observable<any> {
    return this.http.put(this.urlProviders + '/' + provider.id, provider);
  }

  deleteProvider(id: any) {
    return this.http.delete(this.urlProviders + '/' + id);
  }
  getProvider(id: number): Observable<Provider> {
    return this.http.get<Provider>(this.urlProviders + '/' + id);
  }
}
