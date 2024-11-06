import { Component, inject } from '@angular/core';
import { ArticleService } from '../services/article.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ArticleNavBarComponent } from '../article-nav-bar/article-nav-bar.component';

@Component({
  selector: 'app-add-article',
  standalone: true,
  imports: [FormsModule,ArticleNavBarComponent],
  templateUrl: './add-article.component.html',
  styleUrl: './add-article.component.css',
})
export class AddArticleComponent {
  articleService = inject(ArticleService);
  router = inject(Router);

  provider: any;

  createArticle(myform: any) {
    this.articleService
      .createArticle(myform)
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

