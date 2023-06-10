import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'name-form',
  template: `
    <form action="" class=""
      #nameForm="ngForm" (ngSubmit)="setUsername(nameForm)">
      <div class="ui action input">
        <input type="text" placeholder="ime igrača" name="username" #username="ngModel" required ngModel>
        <button class="ui button" type="submit" [disabled]="!nameForm.valid">ustavi</button>
      </div>
    </form>
  `
})
export class NameFormComponent {

  @Output() setName = new EventEmitter();

  setUsername(name: NgForm) {
    this.setName.emit(name.value.username);
    console.log(name);
  }

}
