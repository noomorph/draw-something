import {Component, ElementRef, Input, OnChanges} from '@angular/core';
import { Player } from "./player.model";
@Component({
  selector: 'game',
  template: `
    <div class="ui text container">
      <div class="ui center aligned raised teal segment">
        <p *ngIf="word">Prošu, narysuj <span class="ui blue header">{{word}}</span></p>
        <p *ngIf="!word">
          <img src="/images/{{drawer.imageId}}.jpg" class="ui mini middle aligned avatar image">
          {{drawer.name}} rysuje <code>{{hint}}</code>
        </p>
        <p>Ostavaje časa: {{timeLeft}}</p>
      </div>
    </div>
    <div class="ui center aligned container segment">
        <paper> </paper>
    </div>
    <div class="ui text container segment">
      <chat [isDrawer]="isDrawer" [length]="hintLength"> </chat>
    </div>
  `
})
export class GameComponent implements OnChanges {
  @Input() word: string;
  @Input() drawer: Player;
  @Input() hint: string;
  @Input() timeLeft: number;
  hintLength: string;
  isDrawer: boolean;

  ngOnChanges() {
    this.hintLength = String((this.hint || '').length);
    this.isDrawer = this.word ? true : false;
  }
}
