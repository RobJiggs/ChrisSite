import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Items } from './items';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
 
  private baseUrl = 'http://localhost:8080';
  constructor(private http:HttpClient) { }






  searchItems(
    sex?: string,
    category?: string,
    color?: string,
    minPrice?: number,
    maxPrice?: number,
    size?: string,
    itemName?: string,
    dateAdded?: string,
    featured?:boolean
  ): Observable<Items[]> {
    const url = `${this.baseUrl}/api/user/items/search`;
  
    let params = new HttpParams();
    if (sex) {
      params = params.set('sex', sex);
    }
    if (category) {
      params = params.set('category', category);
    }

    if (color) {
      params = params.set('color', color);
    }
    if (minPrice) {
      params = params.set('minPrice', minPrice);
    }
    if (maxPrice) {
      params = params.set('maxPrice', maxPrice);
    }
    if (size) {
      params = params.set('size', size);
    }
    
    if (itemName) {
      params = params.set('itemName', itemName);
    }
    if (dateAdded) {
      
      params = params.set('dateAdded', dateAdded);
    }
    if (featured) {
      params = params.set('featured', featured);
    }

    // Repeat this pattern for other optional parameters
  
    return this.http.get<Items[]>(url, { params });
  }

  getItemContaining(itemName:any): Observable<any> {

    return this.http.get(`${this.baseUrl}` + '/api/user/items/search/'+`${itemName}`);  

  }

  getItemList(): Observable<any> {

    return this.http.get(`${this.baseUrl}` + '/api/user/items/all');  

  }

  getItemSizes(name:string,color:string,sex:string){
    
    return this.http.get(`${this.baseUrl}`+'/api/user/item/'+`${name}`+'/'+`${color}`+'/'+`${sex}`+'/sizes')






  }
  getInfoByName(name:string){

    return this.http.get(`${this.baseUrl}`+'/api/user/find/name/items'+'/'+`${name}`)


  }
  changeItemPic(name: string, color: string, sex: string, size: string) {
    return this.http.get(
      `${this.baseUrl}/api/user/item/details/${name}/${color}/${sex}/${size}`,
     
    );
  }
  massAddItems(csvFile: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('csvFile', csvFile);
    

    return this.http.post(`${this.baseUrl}/api/user/create/items`, formData);
  }







  
}
