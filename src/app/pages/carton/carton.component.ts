import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';

@Component({
  selector: 'app-carton',
  templateUrl: './carton.component.html',
  styleUrls: ['./carton.component.scss']
})
export class CartonComponent implements OnInit {

  public lotoNumbers: Array<Number>;
  public lotoNumbersCalled: Array<Boolean>;
  public arrayColors: Array<String>;
  public selectedColor: number;

  constructor() {
    this.lotoNumbers = new Array<Number>();
    this.lotoNumbersCalled = new Array<Boolean>();

    for (let index = 0; index < 10; index++) {
      let number = this.randomIntFromInterval(1,50);
      while(this.lotoNumbers.includes(number)) {
        number = this.randomIntFromInterval(1,50);
      }
      this.lotoNumbers.push(number) 
      this.lotoNumbersCalled.push(false);     
    }
    this.lotoNumbers.sort(this.sortNumber);
    this.initializeArrayColors();
    this.selectedColor = this.randomIntFromInterval(0,3);
  }

  ngOnInit(): void {
  }

  public callNumber(i: number) {
    this.lotoNumbersCalled[i] = !this.lotoNumbersCalled[i];
    console.log("call")
  }

  private randomIntFromInterval(min: number, max: number) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private sortNumber ( a, b ){ return a - b; }

  private initializeArrayColors() {
    this.arrayColors = new Array<String>();
    this.arrayColors.push('pink');
    this.arrayColors.push('green');
    this.arrayColors.push('blue');
    this.arrayColors.push('orange');
  }

}
