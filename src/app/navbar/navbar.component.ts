import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  logoPath: string = '';

  ngOnInit(): void {
    const hour = new Date().getHours();
    this.logoPath = hour >= 6 && hour < 18 ? 'logoDia.png' : 'logoNoche.png';
  }
}
