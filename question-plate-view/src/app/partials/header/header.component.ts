import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EventEmitterSingleton } from '@js-emitter/event-emitter-light';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  title: string = '';
  topic: string = '';
  subscription: any;

  constructor(
    private router: Router,
  ) {
    this.subscription = new EventEmitterSingleton().subscribe({ on: 'topic', next: (value) => {
      this.topic = ` / ${value || ''}`;
    }})
  }

  ngAfterViewInit(): void {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        setTimeout(() => {
          this.title = document.title;
        }, 100);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
