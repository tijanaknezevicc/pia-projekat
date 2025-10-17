import { Component, inject, OnInit } from '@angular/core';
import { PropertyService } from '../services/property.service';
import { Property } from '../models/property';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-guest',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.css'
})
export class GuestComponent implements OnInit {

  constructor() { }

  propertyCount: number = 0
  touristCount: number = 0
  ownerCount: number = 0
  res24h: number = 0
  res7d: number = 0
  res30d: number = 0

  properties: Property[] = []
  searchName: string = ''
  searchLocation: string = ''
  sortBy: string = 'name'
  sortOrder: 'asc' | 'desc' = 'asc'
  selectedSort: string = 'name-asc'

  propertyService = inject(PropertyService)

  ngOnInit(): void {
    this.load()
    this.getStats()
  }

  getStats() {
    this.propertyService.getGuestStats().subscribe((data: any) => {
      this.propertyCount = data["propertyCount"]
      this.ownerCount = data["ownerCount"]
      this.touristCount = data["touristCount"]
      this.res24h = data["res24h"]
      this.res7d = data["res7d"]
      this.res30d = data["res30d"]
    })
  }

  load() {
    this.propertyService.getProperties(this.searchName, this.searchLocation, this.sortBy, this.sortOrder).subscribe(data => {
      this.properties = data
    })
  }

  onSortChange(event: Event) {
    let [column, order] = (event.target as HTMLSelectElement).value.split('-') as [string, 'asc' | 'desc']
    [this.sortBy, this.sortOrder] = [column, order]

    this.load()
  }

}
