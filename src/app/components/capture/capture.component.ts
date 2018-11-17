import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject, OnDestroy } from '@angular/core';
import { BusinessCard } from '../../models/business-card';
import { BusinessCardService } from '../../services/business-card.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VisionService } from '../../services/vision.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.css']
})
export class CaptureComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('video')
  video: ElementRef;

  @ViewChild('canvas')
  canvas: ElementRef;

  private unsubscribe$ = new Subject<void>();
  private _businessCardSubject = new BehaviorSubject<BusinessCard>(null);
  businessCard$ = this._businessCardSubject.asObservable();
  showCapture = false;

  constructor(private businessCardService: BusinessCardService,
    private visionService: VisionService,
    private historyService: HistoryService,
    public dialogRef: MatDialogRef<CaptureComponent>) {
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.doVideoStuff();
  }

  // TextDetection
  capture() {
    this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, 640, 480);
    const encodedImage = this.canvas.nativeElement.toDataURL('image/png').split(',')[1];
    this.showCapture = true;
    this.visionService.readImage(encodedImage).pipe(takeUntil(this.unsubscribe$))
      .subscribe((businessCardText: string[]) => {
        businessCardText.forEach(fullText => {
          this.businessCardService.parseBusinessCard(fullText).pipe(takeUntil(this.unsubscribe$))
          .subscribe((businessCard: BusinessCard) => {
            businessCard.imageUri = encodedImage;
            this.confirmBusinessCard(businessCard);
          });
        });
      });
  }

  confirmBusinessCard(businessCard: BusinessCard) {
    this._businessCardSubject.next(businessCard);
  }

  addBusinessCard() {
    if (this._businessCardSubject.getValue()) {
      this.businessCardService.addBusinessCard(this._businessCardSubject.getValue());
    }
    this.closeCapture();
  }

  closeCapture() {
    this.showCapture = false;
    this._businessCardSubject.next(null);
    this.doVideoStuff();
  }

  retake() {
    this.historyService.addHistory('undo - User parsed a business card but wasn\'t satisfied so they clicked "try again"');
    this.closeCapture();
  }
  close() {
    this.dialogRef.close();
  }

  doVideoStuff() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.video.nativeElement.src = window.URL.createObjectURL(stream);
        this.video.nativeElement.play();
      });
    }
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
