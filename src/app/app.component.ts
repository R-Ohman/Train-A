import { NgClass } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@core/components/header/header.component';

import { routeTransition } from './route-transition';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, NgClass, MatIcon, MatMiniFabButton],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeTransition],
})
export class AppComponent {
  showScrollButton = signal(false);

  constructor(protected route: ActivatedRoute) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const showScrollButtonThreshold = 1000;
    this.showScrollButton.set(window.scrollY >= showScrollButtonThreshold);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  getAnimationData() {
    let childRoute = this.route;
    while (childRoute.firstChild) {
      childRoute = childRoute.firstChild;
    }
    return childRoute.snapshot.data.animation || null;
  }
}
