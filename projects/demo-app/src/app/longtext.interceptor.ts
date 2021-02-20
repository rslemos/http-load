import { Injectable } from '@angular/core';

import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { HttpDownloadProgressEvent } from '@angular/common/http';

import { Observable } from 'rxjs';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable()
export class LongtextInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<string>, next: HttpHandler): Observable<HttpEvent<string>> {
    if (req.url !== 'longtext') {
      return next.handle(req);
    }

    return interval(500).pipe(
      take(1000),
      map(i => ({
        type: HttpEventType.DownloadProgress,
        loaded: i*1024,
        total: 1000*1024
      } as HttpDownloadProgressEvent)),
    );
  }
}
