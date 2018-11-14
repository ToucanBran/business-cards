import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { BusinessCard } from '../../models/business-card';
import { BusinessCardService } from '../../services/business-card.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VisionService } from '../../services/vision.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.css']
})
export class CaptureComponent implements OnInit, AfterViewInit {

  @ViewChild('video')
  video: ElementRef;

  @ViewChild('canvas')
  canvas: ElementRef;

  private unsubscribe$ = new Subject<void>();
  constructor(private businessCardService: BusinessCardService,
    private visionService: VisionService,
    public dialogRef: MatDialogRef<CaptureComponent>) {
  }

  ngOnInit() { }

  ngAfterViewInit() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.video.nativeElement.src = window.URL.createObjectURL(stream);
        this.video.nativeElement.play();
      });
    }
  }

  capture() {
    this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, 640, 480);
    const encodedImage = this.canvas.nativeElement.toDataURL('image/png').split(',')[1];
    this.visionService.readImage(encodedImage).pipe(takeUntil(this.unsubscribe$))
      .subscribe((businessCardText: string[]) => {
        businessCardText.forEach(fullText => {
          this.businessCardService.parseBusinessCard(fullText);
        });
      });

    // const bcard = Object.assign(new BusinessCard(), {
    //   firstName: 'brandon',
    //   lastName: 'gomez',
    //   email: 'bg@gmail.com',
    //   phoneNumber: '111-1111'
    // });

    // this.businessCardService.addBusinessCard(bcard);
  }

  close() {
    this.dialogRef.close();
  }
}
