import { Component, Input } from '@angular/core';

@Component({
  selector: 'winner',
  template: `
    <div *ngIf="winner" class="ui center aligned segment">
      <p *ngIf="winner.user">Šampion raunda: <b>{{winner.user.name}}</b></p>
      <p>{{winner.message}}</p>
    </div>
  `
})
export class WinnerComponent {
  @Input() winner;
}
