// Import Angular services
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemdetailService {
  // Use subjects to communicate between components
  private selectedItemSubject = new Subject<any>();
  selectedItem$ = this.selectedItemSubject.asObservable();

  setSelectedItem(item: any) {
    // Notify subscribers with the selected item
    this.selectedItemSubject.next(item);
  }
}
