import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-provider-nav-bar',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './provider-nav-bar.component.html',
  styleUrl: './provider-nav-bar.component.css',
})
export class ProviderNavBarComponent {}
