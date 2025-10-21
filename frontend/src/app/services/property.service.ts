import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Property } from '../models/property';
import { Reservation } from '../models/reservation';
import { User } from '../models/user';

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

  getPropertyByName(name: string): Observable<Property> {
    return this.http.get<Property>(`${this.url}/property-details/${encodeURIComponent(name)}`)
  }

  getMyProperties(user: User): Observable<Property[]> {
    return this.http.post<Property[]>(`${this.url}/get-my-properties/`, user)
  }

  deleteProperty(property: Property) {
    return this.http.get<string>(`${this.url}/delete-property/${encodeURIComponent(property.name)}`);
  }

  addProperty(formData: FormData): Observable<any> {
    return this.http.post(`${this.url}/add-property`, formData);
  }

  updateProperty(propertyName: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.url}/update-property/${encodeURIComponent(propertyName)}`, formData);
  }

  addReservation(reservation: Reservation) {
    return this.http.post(`${this.url}/add-reservation`, reservation);
  }

  blockProperty(property: Property) {
    return this.http.post(`${this.url}/block-property`, property);
  }
}
