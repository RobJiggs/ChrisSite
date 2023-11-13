// search-bar.service.ts

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchBarService {
  private searchContentSubject = new Subject<string>();
  public searchContent$ = this.searchContentSubject.asObservable();

  setSearchContent(searchContent: string) {
    this.searchContentSubject.next(searchContent);
  }
}
