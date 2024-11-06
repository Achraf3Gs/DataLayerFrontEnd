import { NgxSpinnerService } from 'ngx-spinner';
import {
  NgxSpinner,
  Spinner,
} from './../../../node_modules/ngx-spinner/lib/ngx-spinner.enum.d';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  busyRequestCount = 0;

  constructor(private SpinnerService: NgxSpinnerService) {}

  busy() {
    this.busyRequestCount++,
      this.SpinnerService,
      this.SpinnerService.show(undefined, {
        type: 'line-spin-fade',
        bdColor: 'rgba(0,0,0,0.8)',
        color: '#fff',
        size: 'default',
      });
  }
  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      (this.busyRequestCount = 0), this.SpinnerService.hide();
    }
  }
}
