import { Component, inject } from '@angular/core';
import { ProviderService } from '../services/provider.service';
import { ArticleService } from '../services/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '../model/Article';
import { catchError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Provider } from '../model/Provider';
import { ArticleNavBarComponent } from '../article-nav-bar/article-nav-bar.component';

@Component({
  selector: 'app-update-article',
  standalone: true,
  imports: [FormsModule, ArticleNavBarComponent],
  templateUrl: './update-article.component.html',
  styleUrl: './update-article.component.css',
})
export class UpdateArticleComponent {
  articleService = inject(ArticleService);
  providerService = inject(ProviderService);
  router = inject(Router);
  activateRoute = inject(ActivatedRoute);

  id: any;
  providerId: any;
  provider: any;
  articleToUpdate: Article | undefined;
  label: string = '';
  price: string = '';
  picture: string = '';

  ngOnInit() {
    this.id = this.activateRoute.snapshot.paramMap.get('id');
    this.providerId = this.activateRoute.snapshot.paramMap.get('providerId');

    this.providerService
      .getProvider(Number(this.providerId))
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((response: Provider) => {
        this.provider = response;
        console.log('Fetched provider:', this.provider);
      });
    console.log('articleId' + this.id);
    console.log('providerId:', this.providerId);
    console.log('provider?:', this.provider);
    this.articleService
      .getArticle(this.id)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((response: Article) => {
        this.articleToUpdate = response;
        console.log(this.articleToUpdate);
        this.label = response.label;
        this.price = response.price;
        this.picture = response.picture;
      });
  }

  updateArticle() {
    this.articleToUpdate = {
      id: this.id,
      label: this.label,
      price: this.price,
      picture: this.picture,
      provider: this.provider,
    };
    this.articleService
      .updateArticle(this.articleToUpdate)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['listArticle']);
      });
  }
}
