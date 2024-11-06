import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Article } from '../model/Article';
import { Observable } from 'rxjs';
import { ProviderService } from './provider.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  urlArticles = environment.urlArticles;
  article: any;

  http = inject(HttpClient);
  providerService = inject(ProviderService);
  listArticles() {
    return this.http.get(this.urlArticles + '/list');
  }

  createArticle(myform: any) {
    this.article = {
      providerId: myform.value.articleProviderId,
      label: myform.value.articleLabel,
      price: myform.value.articlePrice,
      picture: myform.value.articlePicture,
      provider: this.providerService.getProvider(
        myform.value.articleProviderId
      ),
    };
    console.log(this.article);
    return this.http.post(
      `${this.urlArticles}/add/${myform.value.articleProviderId}`,
      this.article
    );
  }

  updateArticle(article: Article): Observable<any> {
    return this.http.put(
      `${this.urlArticles}/update/${article.provider.id}/${article.id}`,
      article
    );
  }

  deleteArticle(id: any) {
    console.log(this.urlArticles + '/' + id);
    return this.http.delete(this.urlArticles + '/delete/' + id);
  }
  getArticle(id: number): Observable<Article> {
    return this.http.get<Article>(this.urlArticles + '/' + id);
  }
}
