import { Component, OnDestroy, OnInit } from '@angular/core';
import { element } from 'protractor';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-bombo',
  templateUrl: './bombo.component.html',
  styleUrls: ['./bombo.component.scss']
})
export class BomboComponent implements OnInit, OnDestroy {

  public numbers: Array<Number>;
  public numbersCalled: Array<Boolean>;
  public lastBall: Number = 0;
  public shake: boolean = true;
  public subscriptor: Subscription;


  constructor() { 
    this.numbers = Array.from({length: 50}, (_, i) => i + 1);
    this.numbersCalled = new Array(50).fill(false);
  }

  ngOnInit(): void {
    this.subscriptor =  fromEvent(window, 'resize')
        .subscribe(res => {
          let numbersClass = document.querySelector<HTMLElement>(".bombo-screen-content-numbers");
          let heightNumber = numbersClass.offsetHeight;
          let widthNumber = numbersClass.offsetWidth;
          if(widthNumber < 890) {
            this.resize();
          }
        });
    setTimeout(()=>{
      this.resize();
    }, 100);
  }

  ngOnDestroy():void {
    this.subscriptor.unsubscribe();
  }

  public nextBall() {
    if(this.numbersCalled.includes(false)) {
      let number = this.randomIntFromInterval(0,49);
      while(this.numbersCalled[number] === true) {
        number = this.randomIntFromInterval(0,49);
      }
      this.numbersCalled[number] = true;
      this.lastBall = number +1;
    }
    this.shake = false;
  }

  private randomIntFromInterval(min: number, max: number) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private resize() {
    let numbersClass = document.querySelector<HTMLElement>(".bombo-screen-content-numbers");
    let heightNumber = numbersClass.offsetHeight;
    let widthNumber = numbersClass.offsetWidth;
    let value = Math.trunc(Math.sqrt((heightNumber * widthNumber)/50)) - 12;
    let numberClass = document.getElementsByClassName("bombo-screen-content-numbers-number");
    for (let index = 0; index < numberClass.length; index++) {
      let element = numberClass[index] as HTMLElement;
      element.style.height = value + "px";
      element.style.width = value + "px";
      element.style.opacity = "1";
    }
    let numberFontClass = document.getElementsByClassName("bombo-screen-content-numbers-number-text");
    for (let index = 0; index < numberFontClass.length; index++) {
      let element = numberFontClass[index] as HTMLElement;
      element.style.fontSize = value/2 + "px";
      element.style.height = value/1.5 + "px";
      element.style.width = value/1.5 + "px";

    }
  }

}
