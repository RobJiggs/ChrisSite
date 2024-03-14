

import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SizeSelectionService {
  sizeSelected: EventEmitter<void> = new EventEmitter<void>();

  triggerSizeSelected() {
    this.sizeSelected.emit();
  }
}
