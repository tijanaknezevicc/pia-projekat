import { Component, inject } from '@angular/core';
import { Property } from '../models/property';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PropertyService } from '../services/property.service';

@Component({
  selector: 'app-admin-properties',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-properties.component.html',
  styleUrl: './admin-properties.component.css'
})
export class AdminPropertiesComponent {

  all: Property[] = []

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
    this.propertyService.getProperties('', '', 'name', 'asc').subscribe(data => {
      this.all = data
    })
  }

  isCritical(property: Property): boolean {

    if (property.comments.length < 3) {
      return false
    }

    let recent = property.comments.slice(-3)
    return recent.every(c => c.rating < 2)
  }

  isBlocked(property: Property): boolean {
    if (!property.dateBlocked) {
      return false
    }

    let now = new Date()
    let blockEnds = new Date(property.dateBlocked)
    blockEnds.setDate(blockEnds.getDate() + 2)

    return now < blockEnds
  }

  block(property: Property) {
    this.propertyService.blockProperty(property).subscribe(ok => {
      alert('vikendica blokirana')
      this.ngOnInit()
    })
  }
}
