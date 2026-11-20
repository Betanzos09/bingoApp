import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BingoService } from '../../shared/services/bingo.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  colors = ['blue', 'red', 'green', 'orange', 'pink'];
  selectedColor = 'random';
  randomPreviewColor = 'blue';
  selectedRows = 3;
  maxBalls = 50;
  previewCells = [
    { ball: true }, { ball: true }, { number: 28 }, { number: 33 }, { ball: true }, { number: 59 }, { number: 65 }, { ball: true }, { number: 87 },
    { ball: true }, { number: 17 }, { ball: true }, { number: 36 }, { number: 41 }, { ball: true }, { ball: true }, { number: 70 }, { number: 90 },
    { number: 4 }, { number: 19 }, { ball: true }, { ball: true }, { number: 42 }, { ball: true }, { number: 67 }, { number: 73 }, { ball: true }
  ];

  constructor(private router: Router, private bingo: BingoService) { this.maxBalls = bingo.getMaxBalls(); this.selectedRows = bingo.getRows(); this.selectedColor = bingo.getColor(); if (this.selectedColor === 'random') this.randomPreviewColor = this.colors[Math.floor(Math.random() * this.colors.length)]; }
  selectMaxBalls(maxBalls: number): void { this.maxBalls = maxBalls; this.bingo.setMaxBalls(maxBalls); }
  selectRows(rows: number): void { this.selectedRows = rows; this.bingo.setRows(rows); }
  selectColor(color: string): void { this.selectedColor = color; if (color === 'random') this.randomPreviewColor = this.colors[Math.floor(Math.random() * this.colors.length)]; this.bingo.setColor(color); }
  get previewColor(): string { return this.selectedColor === 'random' ? this.randomPreviewColor : this.selectedColor; }


  navigateBombo() {
    this.router.navigateByUrl('/bombo');
  }

  navigateCarton() {
    this.router.navigateByUrl('/carton');
  }

}
