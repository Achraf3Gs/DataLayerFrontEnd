import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-nav-bar-principal',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './nav-bar-principal.component.html',
  styleUrl: './nav-bar-principal.component.css',
})
export class NavBarPrincipalComponent {}
