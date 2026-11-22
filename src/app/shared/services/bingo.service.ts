import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BingoService {
  private maxBalls = 50;
  private rows = 3;
  private color = 'random';
  getMaxBalls(): number { return this.maxBalls; }
  setMaxBalls(maxBalls: number): void { this.maxBalls = maxBalls; }
  getRows(): number { return this.rows; }
  setRows(rows: number): void { this.rows = rows; }
  getColor(): string { return this.color; }
  setColor(color: string): void { this.color = color; }
  createSequence(maxBalls: number = this.maxBalls): number[] {
    const numbers = Array.from({ length: maxBalls }, (_, index) => index + 1);
    for (let index = numbers.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [numbers[index], numbers[swapIndex]] = [numbers[swapIndex], numbers[index]];
    }
    return numbers;
  }

  createTicket(): number[] { return this.createSequence().slice(0, 15).sort((a, b) => a - b); }

  createTicketLayout(rows: number, maxBalls: number): Array<{ number?: number; ball: boolean }> {
    if (rows === 2) {
      return this.createSequence(maxBalls).slice(0, 10).map(number => ({ number, ball: false }));
    }

    const layout: Array<{ number?: number; ball: boolean }> = [];
    const used = new Set<number>();
    const ranges = Array.from({ length: 9 }, (_, column) => {
      const start = maxBalls === 90 ? (column === 0 ? 1 : column * 10) : Math.floor(column * maxBalls / 9) + 1;
      const end = maxBalls === 90 ? (column === 8 ? 90 : column * 10 + 9) : Math.floor((column + 1) * maxBalls / 9);
      return { start, end };
    });

    for (let row = 0; row < rows; row++) {
      const numberColumns = this.shuffle(Array.from({ length: 9 }, (_, index) => index)).slice(0, 5).sort((a, b) => a - b);
      for (let column = 0; column < 9; column++) {
        if (!numberColumns.includes(column)) { layout.push({ ball: true }); continue; }
        const range = ranges[column];
        const available = Array.from({ length: range.end - range.start + 1 }, (_, index) => range.start + index).filter(number => !used.has(number));
        const number = available[Math.floor(Math.random() * available.length)];
        used.add(number); layout.push({ number, ball: false });
      }
    }
    return layout;
  }

  private shuffle<T>(values: T[]): T[] { return values.sort(() => Math.random() - 0.5); }
}
