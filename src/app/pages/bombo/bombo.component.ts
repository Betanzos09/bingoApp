import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Html5Qrcode } from 'html5-qrcode';
import { BingoService } from '../../shared/services/bingo.service';
import { ClaimResult, ClaimService, TicketClaim } from '../../shared/services/claim.service';

@Component({ selector: 'app-bombo', standalone: false, templateUrl: './bombo.component.html', styleUrls: ['./bombo.component.scss'] })
export class BomboComponent implements OnDestroy {
  @ViewChild('resetDialog') resetDialog: ElementRef<HTMLDialogElement>;
  @ViewChild('scannerDialog') scannerDialog: ElementRef<HTMLDialogElement>;
  numbers: number[];
  drawOrder: number[];
  numbersCalled: boolean[];
  lastBall = 0;
  result: ClaimResult | null = null;
  scannedClaim: TicketClaim | null = null;
  scannerError = '';
  private scanner: Html5Qrcode | null = null;

  constructor(private bingo: BingoService, public claims: ClaimService, private changeDetector: ChangeDetectorRef) {
    this.numbers = Array.from({ length: bingo.getMaxBalls() }, (_, index) => index + 1);
    this.numbersCalled = this.numbers.map(number => claims.drawn.includes(number));
    this.lastBall = claims.drawn[claims.drawn.length - 1] || 0;
    this.drawOrder = bingo.createSequence().filter(number => !this.numbersCalled[number - 1]);
  }

  get calledCount(): number { return this.claims.drawn.length; }
  get gameFinished(): boolean { return Boolean(this.claims.lineWinner && this.claims.bingoWinners.length); }
  nextBall(): void { if (this.gameFinished) return; const number = this.drawOrder.shift(); if (number === undefined) return; this.numbersCalled[number - 1] = true; this.lastBall = number; this.claims.record(number); }
  requestReset(): void { this.resetDialog.nativeElement.showModal(); }
  closeOnBackdrop(event: MouseEvent, dialog: HTMLDialogElement): void { if (event.target === dialog) dialog.close(); }
  reset(): void { this.resetDialog.nativeElement.close(); this.claims.reset(); this.drawOrder = this.bingo.createSequence(); this.numbersCalled = this.numbers.map(() => false); this.lastBall = 0; this.result = null; this.scannedClaim = null; }

  async openScanner(): Promise<void> {
    this.scannerError = ''; this.result = null; this.scannedClaim = null;
    this.scannerDialog.nativeElement.showModal();
    this.scanner = new Html5Qrcode('bingo-qr-reader');
    try {
      await this.scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: 240 }, async raw => {
        await this.stopScanner();
        const claim = this.claims.parse(raw, this.numbers.length);
        if (!claim) this.result = { status: 'invalid', message: 'QR inválido o cartón de otra modalidad.' };
        else { this.scannedClaim = claim; this.result = this.claims.inspect(claim); if (this.result.status === 'line' || this.result.status === 'bingo') this.result = this.claims.award(claim, this.result.status); }
        this.changeDetector.detectChanges();
      }, () => {});
    } catch { this.scannerError = 'No se pudo abrir la cámara. Revisa los permisos y usa HTTPS o localhost.'; this.changeDetector.detectChanges(); }
  }
  async closeScanner(): Promise<void> { await this.stopScanner(); if (this.scannerDialog.nativeElement.open) this.scannerDialog.nativeElement.close(); }
  private async stopScanner(): Promise<void> { if (!this.scanner) return; const scanner = this.scanner; this.scanner = null; if (scanner.isScanning) await scanner.stop(); scanner.clear(); }
  award(type: 'line' | 'bingo'): void { if (this.scannedClaim) this.result = this.claims.award(this.scannedClaim, type); }
  ngOnDestroy(): void { void this.stopScanner(); }
}
