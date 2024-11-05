import { Component, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit {
  title: string = '';

  constructor(
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        setTimeout(() => {
          this.title = document.title;
        }, 100);
      }
    });
  }
}
