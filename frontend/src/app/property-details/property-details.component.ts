import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../services/property.service';
import { Property } from '../models/property';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.css'
})
export class PropertyDetailsComponent implements OnInit, AfterViewInit {

  constructor() { }

  private route = inject(ActivatedRoute)
  private propertyService = inject(PropertyService)
  private router = inject(Router)
  property!: Property
  backendUrl: string = "http://localhost:4000/assets/"
  map: any
  mapInitialized = false;

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.propertyService.getPropertyByName(name).subscribe(data => {
        this.property = data;
      })
    }
  }

  ngAfterViewInit(): void {
    this.initMap()
  }

  private initMap() {
    const lat = this.property!.coordinates.x
    const lng = this.property!.coordinates.y

    this.map = L.map('map').setView([lat, lng], 15)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map)

    L.circleMarker([lat, lng], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.9,
      radius: 5
    }).addTo(this.map)

  }

  bookProperty() {
    localStorage.setItem('bookingProperty', JSON.stringify(this.property));
    this.router.navigate(['/book-property']);
  }
}
