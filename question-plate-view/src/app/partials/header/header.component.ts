import { Component, OnInit, OnDestroy, DestroyRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EventEmitterSingleton } from '@js-emitter/event-emitter-light';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  title: string = '';
  header: string = '';
  topic: string = '';
  currentUrl: string = '';
  subscription: any;

  constructor(
    private router: Router,
    private destroyRef: DestroyRef,
    private titleService: Title,
  ) {
    this.subscription = new EventEmitterSingleton().subscribe({ 
      on: 'topic', 
      next: (value: string) => {
        this.topic = value;
        this.updateHeader();
      }
    });
  }

  ngOnInit(): void {
    this.router.events.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    ).subscribe(({ url }) => {
      this.currentUrl = url;
      setTimeout(() => {
        this.updateHeader();
      }, 100);
    });
  }

  private updateHeader(): void {
    const isQuestionsRoute = this.currentUrl.includes('/questions');
    const pageTitle = this.titleService.getTitle();
    
    this.header = isQuestionsRoute && this.topic 
      ? `${pageTitle} / ${this.topic}` 
      : pageTitle;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
