import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Property } from '../models/property';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor() { }

  private http = inject(HttpClient)
  private url = "http://localhost:4000/properties"

  getGuestStats() {
    return this.http.get<number[]>(`${this.url}/guest-stats`)
  }

  getProperties( searchName?: string, searchLocation?: string, sortBy?: string, sortOrder?: 'asc' | 'desc') : Observable<Property[]> {

    let params = new HttpParams();

    if (searchName) { params = params.set('searchName', searchName) }
    if (searchLocation) { params = params.set('searchLocation', searchLocation) }
    if (sortBy) { params = params.set('sortBy', sortBy) }
    if (sortOrder) { params = params.set('sortOrder', sortOrder) }

    return this.http.get<Property[]>(`${this.url}/all-properties`, { params })
  }


}
