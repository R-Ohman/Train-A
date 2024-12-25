import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const routeTransition = trigger('routeTransition', [
  transition('RidePage => RoutePage', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: '65px',
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true },
    ),
    query(':enter', [style({ left: '-100%' })], { optional: true }),
    query(':leave', [style({ left: '0%' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(
        ':leave',
        [animate('300ms ease-out', style({ left: '100%', opacity: 0 }))],
        { optional: true },
      ),
      query(':enter', [animate('200ms ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
      query('@*', animateChild(), { optional: true }),
    ]),
  ]),
  transition('RoutePage => RidePage', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: '65px',
          left: 0,
          width: '100%',
        }),
      ],
      { optional: true },
    ),
    query(':enter', [style({ left: '100%' })], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    group([
      query(
        ':leave',
        [animate('200ms ease-out', style({ left: '-100%', opacity: 0 }))],
        { optional: true },
      ),
      query(':enter', [animate('300ms ease-out', style({ left: '0%' }))], {
        optional: true,
      }),
      query('@*', animateChild(), { optional: true }),
    ]),
  ]),
]);
