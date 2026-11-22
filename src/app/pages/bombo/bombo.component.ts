import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { BingoService } from '../../shared/services/bingo.service';

@Component({
  selector: 'app-bombo',
  standalone: false,
  templateUrl: './bombo.component.html',
  styleUrls: ['./bombo.component.scss']
})
export class BomboComponent implements OnInit, OnDestroy {

  public numbers: Array<Number>;
  public drawOrder: number[];
  public numbersCalled: Array<Boolean>;
  public lastBall: Number = 0;
  public shake: boolean = true;
  public subscriptor: Subscription;


  constructor(private bingo: BingoService) { 
    this.drawOrder = bingo.createSequence();
    this.numbers = Array.from({length: this.drawOrder.length}, (_, i) => i + 1);
    this.numbersCalled = new Array(this.numbers.length).fill(false);
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
      const number = this.drawOrder.find(value => !this.numbersCalled[value - 1]);
      this.numbersCalled[number - 1] = true;
      this.lastBall = number;
    }
    this.shake = false;
  }

  public get calledCount(): number { return this.numbersCalled.filter(Boolean).length; }
  public reset(): void { this.drawOrder = this.bingo.createSequence(); this.numbersCalled = new Array(this.drawOrder.length).fill(false); this.lastBall = 0; this.shake = true; }

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
