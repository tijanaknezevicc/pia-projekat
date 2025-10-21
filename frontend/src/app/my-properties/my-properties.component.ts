import { Component, inject, OnInit } from '@angular/core';
import { PropertyService } from '../services/property.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Property } from '../models/property';
import { User } from '../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-properties.component.html',
  styleUrl: './my-properties.component.css'
})
export class MyPropertiesComponent implements OnInit{

  private propertyService = inject(PropertyService)
  private router = inject(Router)
  user: User = new User()
  properties: Property[] = []

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('logged')!)
    this.propertyService.getMyProperties(this.user).subscribe(data => {
      this.properties = data
    })
  }

  getAvgGrade(property: Property): number {
    if (!property.comments || property.comments.length === 0) { return 0 }

    let sum = 0
    for (let comment of property.comments) {
      sum += comment.rating
    }
    return sum / property.comments.length
  }

  edit(property: Property) {
    this.router.navigate(['/edit-property', property.name])
  }

  add() {
    this.router.navigate(['/add-property'])
  }

  deleteProperty(property: Property) {
    this.propertyService.deleteProperty(property).subscribe(() => {
      this.ngOnInit()
    })
  }

}
