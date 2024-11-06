import { ProviderNavBarComponent } from './provider-nav-bar/provider-nav-bar.component';
import { ArticleNavBarComponent } from './article-nav-bar/article-nav-bar.component';
import { Routes } from '@angular/router';
import { ListProviderComponent } from './list-provider/list-provider.component';
import { AddProviderComponent } from './add-provider/add-provider.component';
import { UpdateProviderComponent } from './update-provider/update-provider.component';
import { LoginComponent } from './login/login.component';
import { NavBarPrincipalComponent } from './nav-bar-principal/nav-bar-principal.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'Register', component: RegisterPageComponent },

 
  {
    path: 'navbar',
    component: NavBarPrincipalComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'Providers',
        component: ProviderNavBarComponent,
        canActivate: [authGuard],
      },
      {
        path: 'Articles',
        component: ArticleNavBarComponent,
        canActivate: [authGuard],
      },
    ],
  },

  {
    path: 'listProvider',
    loadComponent: () => {
      return import('./list-provider/list-provider.component').then(
        (m) => m.ListProviderComponent
      );
    },
    canActivate: [authGuard],
  },
  {
    path: 'addProvider',
    loadComponent: () => {
      return import('./add-provider/add-provider.component').then(
        (m) => m.AddProviderComponent
      );
    },
    canActivate: [authGuard],
  },
  {
    path: 'updateProvider/:id',
    loadComponent: () => {
      return import('./update-provider/update-provider.component').then(
        (m) => m.UpdateProviderComponent
      );
    },
  },
  {
    path: 'listArticle',
    loadComponent: () => {
      return import('./list-article/list-article.component').then(
        (m) => m.ListArticleComponent
      );
    },
    canActivate: [authGuard],
  },
  {
    path: 'addArticle',
    loadComponent: () => {
      return import('./add-article/add-article.component').then(
        (m) => m.AddArticleComponent
      );
    },
    canActivate: [authGuard],
  },
  {
    path: 'updateArticle/:providerId/:id',
    loadComponent: () => {
      return import('./update-article/update-article.component').then(
        (m) => m.UpdateArticleComponent
      );
    },
  },
];
