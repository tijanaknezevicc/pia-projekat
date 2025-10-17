import { Component, inject } from '@angular/core';
import { PropertyService } from '../services/property.service';
import { Property } from '../models/property';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.css'
})
export class PropertiesComponent {

    properties: Property[] = []
    searchName: string = ''
    searchLocation: string = ''
    sortBy: string = 'name'
    sortOrder: 'asc' | 'desc' = 'asc'
    selectedSort: string = 'name-asc'

    getAvgGrade(property: Property): number {
      if (!property.comments || property.comments.length === 0) { return 0 }

      let sum = 0
      for (let comment of property.comments) {
        sum += comment.rating
      }
      return sum / property.comments.length
    }

    propertyService = inject(PropertyService)
    router = inject(Router)

    ngOnInit(): void {
      this.load()
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
