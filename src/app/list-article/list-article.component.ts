import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ArticleService } from '../services/article.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { Provider } from '../model/Provider';
import { ArticleNavBarComponent } from '../article-nav-bar/article-nav-bar.component';

@Component({
  selector: 'app-list-article',
  standalone: true,
  imports: [NgFor,ArticleNavBarComponent],
  templateUrl: './list-article.component.html',
  styleUrl: './list-article.component.css',
})
export class ListArticleComponent {
  articles: any;
  provider!: Provider;

  articleService = inject(ArticleService);
  router = inject(Router);

  ngOnInit(): void {
    this.articleService.listArticles().subscribe((response) => {
      this.articles = response;
    });
  }
  deleteArticle(id: any) {
    this.articleService
      .deleteArticle(id)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((response) => {
        console.log(response);
        this.refrechListArticles();
      });
  }

  refrechListArticles() {
    this.articleService
      .listArticles()
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((response) => {
        this.articles = response;
      });
  }

  updateArticle(myObj: any) {
    this.provider = myObj.provider;
    const url = `updateArticle/${this.provider['id']}/${myObj['id']}`;
    console.log(url);

    // Properly separate providerId and id with '/'

    this.router.navigate([
      'updateArticle' + '/' + this.provider['id'] + '/' + myObj['id'],
    ]);
  }
}
