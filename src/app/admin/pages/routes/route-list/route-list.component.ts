import { RailRoute } from '@admin/models/route.model';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RouteCardComponent } from '../route-card/route-card.component';

@Component({
  selector: 'app-route-list',
  standalone: true,
  imports: [RouteCardComponent, ScrollingModule],
  templateUrl: './route-list.component.html',
  styleUrl: './route-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteListComponent {
  routes = input.required<RailRoute[]>();
}
