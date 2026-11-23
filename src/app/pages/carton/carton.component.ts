import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { BingoService } from '../../shared/services/bingo.service';
import { TicketClaim } from '../../shared/services/claim.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-carton',
  standalone: false,
  templateUrl: './carton.component.html',
  styleUrls: ['./carton.component.scss']
})
export class CartonComponent {
  @ViewChild('confirmDialog') confirmDialog: ElementRef<HTMLDialogElement>;
  @ViewChild('qrDialog') qrDialog: ElementRef<HTMLDialogElement>;
  pendingAction: 'new' | 'clear' | null = null;
  qrDataUrl = '';
  ticketId = '';
  numbers: number[] = []; marked: boolean[] = []; cells: Array<{ number?: number; ball: boolean }> = [];
  rows = 3; color = 'blue';
  ticketNumber = 1;
  completedRows: boolean[] = [];
  lineMessageVisible = false;
  lineMessage = 'LÍNEA';
  private lineShown = false;
  private bingoShown = false;
  private lineTimer: any;
  constructor(private bingo: BingoService, private changeDetector: ChangeDetectorRef) { this.newTicket(); }
  newTicket(): void { clearTimeout(this.lineTimer); this.qrDataUrl = ''; this.ticketId = this.createTicketId(); this.ticketNumber = (Date.now() % 1000) + 1; this.rows = this.bingo.getRows(); const configuredColor = this.bingo.getColor(); const colors = ['blue', 'red', 'green', 'orange', 'pink']; this.color = configuredColor === 'random' ? colors[Math.floor(Math.random() * colors.length)] : configuredColor; this.cells = this.bingo.createTicketLayout(this.rows, this.bingo.getMaxBalls()); this.numbers = this.cells.filter(cell => !cell.ball).map(cell => cell.number); this.marked = this.numbers.map(() => false); this.completedRows = []; this.lineShown = false; this.bingoShown = false; this.lineMessageVisible = false; this.generateQr(); }
  private createTicketId(): string { const cryptoApi = globalThis.crypto as Crypto & { randomUUID?: () => string }; if (cryptoApi?.randomUUID) return cryptoApi.randomUUID(); return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`; }
  private async generateQr(): Promise<void> { const id = this.ticketId; const width = this.rows === 2 ? 5 : 9; const claim: TicketClaim = { v: 1, id, ticketNumber: String(this.ticketNumber).padStart(4, '0'), maxBalls: this.bingo.getMaxBalls(), lines: Array.from({ length: this.rows }, (_, row) => this.cells.slice(row * width, (row + 1) * width).filter(cell => !cell.ball).map(cell => cell.number)) }; const url = await QRCode.toDataURL(JSON.stringify(claim), { width: 320, margin: 2 }); if (this.ticketId === id) { this.qrDataUrl = url; this.changeDetector.detectChanges(); } }
  request(action: 'new' | 'clear'): void { this.pendingAction = action; this.confirmDialog.nativeElement.showModal(); }
  confirmAction(): void { this.confirmDialog.nativeElement.close(); if (this.pendingAction === 'new') this.newTicket(); else if (this.pendingAction === 'clear') this.clear(); this.pendingAction = null; }
  showQr(): void { this.qrDialog.nativeElement.showModal(); }
  closeOnBackdrop(event: MouseEvent, dialog: HTMLDialogElement): void { if (event.target === dialog) dialog.close(); }
  toggle(index: number): void { this.marked = this.marked.map((value, itemIndex) => itemIndex === index ? !value : value); }
  toggleCell(index: number): void { if (this.cells[index].ball) return; const numberIndex = this.cells.slice(0, index + 1).filter(cell => !cell.ball).length - 1; if (numberIndex >= 0) { this.toggle(numberIndex); this.checkLines(); } }
  isCellMarked(index: number): boolean { if (this.cells[index].ball) return false; const numberIndex = this.cells.slice(0, index + 1).filter(cell => !cell.ball).length - 1; return numberIndex >= 0 && this.marked[numberIndex]; }
  rowForCell(index: number): number { return Math.floor(index / (this.rows === 2 ? 5 : 9)); }
  isLineComplete(row: number): boolean { const width = this.rows === 2 ? 5 : 9; let numberIndex = 0; for (let index = 0; index < row * width; index++) if (!this.cells[index].ball) numberIndex++; const rowNumbers = this.cells.slice(row * width, row * width + width).filter(cell => !cell.ball).length; return rowNumbers > 0 && this.marked.slice(numberIndex, numberIndex + rowNumbers).every(Boolean); }
  private checkLines(): void { const previous = this.completedRows.slice(); this.completedRows = Array.from({ length: this.rows }, (_, row) => this.isLineComplete(row)); const newLine = this.completedRows.some((complete, row) => complete && !previous[row]); const allComplete = this.completedRows.length === this.rows && this.completedRows.every(Boolean); const showBingo = allComplete && !this.bingoShown; const showLine = newLine && !this.lineShown && !allComplete; if (showBingo || showLine) { this.lineMessage = showBingo ? 'BINGO' : 'LÍNEA'; if (showBingo) this.bingoShown = true; else this.lineShown = true; this.lineMessageVisible = true; clearTimeout(this.lineTimer); this.changeDetector.detectChanges(); this.lineTimer = window.setTimeout(() => { this.lineMessageVisible = false; this.changeDetector.detectChanges(); }, 3000); } }
  clear(): void { this.marked = this.numbers.map(() => false); this.completedRows = []; this.lineShown = false; this.bingoShown = false; this.lineMessageVisible = false; clearTimeout(this.lineTimer); }
  get markedCount(): number { return this.marked.filter(Boolean).length; }
}
