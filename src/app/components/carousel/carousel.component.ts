import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  constructor(private router: Router) {}

  goToReservar() {
    this.router.navigate(['/reservar']);
  }
}
