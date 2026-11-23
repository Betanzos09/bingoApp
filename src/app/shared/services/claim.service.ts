import { Injectable } from '@angular/core';

export interface TicketClaim {
  v: 1;
  id: string;
  ticketNumber: string;
  maxBalls: number;
  lines: number[][];
}

export interface ClaimResult {
  status: 'line' | 'bingo' | 'incomplete' | 'already-awarded' | 'invalid';
  message: string;
  ticketId?: string;
  completedLines?: number[];
  missing?: number[];
}

@Injectable({ providedIn: 'root' })
export class ClaimService {
  private readonly key = 'nuevo-bingo-draw-v1';
  drawn: number[] = [];
  lineWinner: string | null = null;
  bingoWinners: string[] = [];

  constructor() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.key) || '{}');
      if (Array.isArray(saved.drawn) && saved.drawn.every((n: unknown) => Number.isInteger(n))) this.drawn = saved.drawn;
      if (typeof saved.lineWinner === 'string') this.lineWinner = saved.lineWinner;
      if (Array.isArray(saved.bingoWinners)) this.bingoWinners = saved.bingoWinners.filter((value: unknown): value is string => typeof value === 'string');
    } catch { /* Ignore invalid saved state. */ }
  }

  record(number: number): void { if (!this.drawn.includes(number)) this.drawn.push(number); this.save(); }
  reset(): void { this.drawn = []; this.lineWinner = null; this.bingoWinners = []; this.save(); }

  parse(raw: string, maxBalls: number): TicketClaim | null {
    try {
      const claim = JSON.parse(raw) as TicketClaim;
      if (claim.v !== 1 || typeof claim.id !== 'string' || !/^[a-f0-9-]{16,64}$/i.test(claim.id) || typeof claim.ticketNumber !== 'string' || claim.maxBalls !== maxBalls || ![2, 3].includes(claim.lines?.length)) return null;
      const values = claim.lines.flat();
      if (claim.lines.some(line => line.length !== 5) || new Set(values).size !== values.length || values.some(n => !Number.isInteger(n) || n < 1 || n > maxBalls)) return null;
      return claim;
    } catch { return null; }
  }

  inspect(claim: TicketClaim): ClaimResult {
    const drawn = new Set(this.drawn);
    const completedLines = claim.lines.flatMap((line, index) => line.every(n => drawn.has(n)) ? [index + 1] : []);
    const missing = claim.lines.flat().filter(n => !drawn.has(n));
    if (missing.length === 0) return { status: this.bingoWinners.includes(claim.ticketNumber) ? 'already-awarded' : 'bingo', message: this.bingoWinners.includes(claim.ticketNumber) ? 'Este bingo ya está adjudicado.' : 'Bingo válido.', ticketId: claim.id, completedLines, missing };
    if (completedLines.length) return { status: this.lineWinner ? 'already-awarded' : 'line', message: this.lineWinner ? 'La línea ya está adjudicada.' : `Línea ${completedLines[0]} válida.`, ticketId: claim.id, completedLines, missing };
    return { status: 'incomplete', message: 'Todavía no hay línea ni bingo.', ticketId: claim.id, completedLines, missing };
  }

  award(claim: TicketClaim, type: 'line' | 'bingo'): ClaimResult {
    const result = this.inspect(claim);
    if (result.status !== type) return result;
    if (type === 'line') this.lineWinner = claim.ticketNumber;
    else if (!this.bingoWinners.includes(claim.ticketNumber)) this.bingoWinners.push(claim.ticketNumber);
    this.save();
    return { ...result, message: type === 'line' ? 'Línea adjudicada' : 'Bingo adjudicado' };
  }

  private save(): void { localStorage.setItem(this.key, JSON.stringify({ drawn: this.drawn, lineWinner: this.lineWinner, bingoWinners: this.bingoWinners })); }
}
