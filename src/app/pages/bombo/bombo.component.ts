import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bombo',
  templateUrl: './bombo.component.html',
  styleUrls: ['./bombo.component.scss']
})
export class BomboComponent implements OnInit {

  public numbers: Array<Number>;
  public numbersCalled: Array<Boolean>;
  public lastBall: Number = 0;


  constructor() { 
    this.numbers = Array.from({length: 50}, (_, i) => i + 1);
    this.numbersCalled = new Array(50).fill(false);
  }

  ngOnInit(): void {
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
  }
  
  private randomIntFromInterval(min: number, max: number) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}
