import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';
import { Player } from "./player.model";
@Component({
  selector: 'app',
  template: `
   <div class="ui container">
     <div *ngIf="!isPlaying">
      <lobby [winner]="winner"> </lobby>
     </div>
     <div *ngIf="isPlaying">
       <game [drawer]="drawer" [word]="word" [hint]="hint" [timeLeft]="timeLeft"> </game>
     </div>
   </div>
  `
})
export class AppComponent implements OnInit {
  word: string;
  hint: string;
  drawer: Player;
  isPlaying: boolean;
  winner: Object;
  timeLeft: number;

  constructor(private gameService: GameService) {}

  public ngOnInit() {
    this.gameService.onGameStart().subscribe((drawer) => {
      this.drawer = drawer;
      this.isPlaying = true;
    });

    this.gameService.onReceiveHint().subscribe((hint) => {
      this.hint = hint;
    });

    this.gameService.onReceiveAnswer().subscribe((word) => {
      this.word = word;
    });

    this.gameService.onGameEnd().subscribe((winner) => {
      this.winner = winner;
      this.isPlaying = false;
      this.word = '';
    });

    this.gameService.timeLeft().subscribe((time: number) => this.timeLeft = time);
  }
}
