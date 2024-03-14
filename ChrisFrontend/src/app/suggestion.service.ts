import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Items } from './items';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  private baseUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) { }

  getSearchSuggestions(suggestion: string): Observable<Items[]> {
    const url = `${this.baseUrl}/items/search/${suggestion}`;
    return this.http.get<Items[]>(url);
  }
}
