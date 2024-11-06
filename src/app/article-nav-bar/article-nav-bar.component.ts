import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthUserService } from '../services/authuser.service';

@Component({
  selector: 'app-article-nav-bar',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './article-nav-bar.component.html',
  styleUrl: './article-nav-bar.component.css',
})
export class ArticleNavBarComponent {
  authUserService = inject(AuthUserService);
  router = inject(Router);
  logOut() {
    this.authUserService.logout();
    this.router.navigateByUrl('/login');
  }
}
