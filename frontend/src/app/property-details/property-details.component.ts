import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../services/property.service';
import { Property } from '../models/property';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.css'
})
export class PropertyDetailsComponent implements OnInit {
bookProperty() {
throw new Error('Method not implemented.');
}

  constructor() { }

  private route = inject(ActivatedRoute)
  private propertyService = inject(PropertyService)
  property: Property | null = null;
  backendUrl: string = "http://localhost:4000/assets/"

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.propertyService.getPropertyByName(name).subscribe(data => {
        this.property = data;
      })
    }
  }


}
