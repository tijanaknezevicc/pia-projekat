import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '../services/property.service';
import { Property } from '../models/property';
import { User } from '../models/user';
import { Reservation } from '../models/reservation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit {

  step1!: FormGroup
  step2!: FormGroup
  step = 1
  property!: Property
  totalPrice = 0
  message = ""
  logged!: User

  private fb = inject(FormBuilder)
  private propertyService = inject(PropertyService)
  private router = inject(Router)

  ngOnInit(): void {
    this.property = JSON.parse(localStorage.getItem('bookingProperty')!)
    this.logged = JSON.parse(localStorage.getItem('logged')!)

    console.log(this.logged);

    this.step1 = this.fb.group({
      dateBeg: ['', Validators.required],
      dateEnd: ['', Validators.required],
      adults: [1, [Validators.required, Validators.min(1)]],
      children: [0, [Validators.required, Validators.min(0)]]
    });

    this.step2 = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^((?:4539|4556|4916|4532|4929|4485|4716)(?: \d{4}){3}|5[1-5]\d{2}(?: \d{4}){3}|(?:30[0-3]\d|36\d{2}|38\d{2}) \d{7} \d{4})$/)]],
      comment: ['', [Validators.maxLength(500)]]
    });
  }

  nextStep() {
    if (this.step1.valid) {
    let { dateBeg, dateEnd } = this.step1.value
    let days = this.getDuration(dateBeg, dateEnd)
    this.calculatePrice(dateBeg, dateEnd)
    this.step = 2
    }
  }

  previousStep() {
    this.step = 1;
  }

  addReservation() {
    if (this.step2.valid) {
      let newReservation = new Reservation();

        newReservation.dateBeg = this.step1.value.dateBeg;
        newReservation.dateEnd = this.step1.value.dateEnd;
        newReservation.propertyName = this.property.name;
        newReservation.propertyLocation = this.property.location;
        newReservation.owner = this.property.owner;
        newReservation.renter = this.logged.username,
        newReservation.guests = {
          adults: this.step1.value.adults,
          children: this.step1.value.children
        },
        newReservation.requests = this.step2.value.comment

      this.propertyService.addReservation(newReservation).subscribe({
        next: (response) => {
          console.log('reservation successful:', response);
          alert('uspesno ste rezervisali vikendicu!')
          this.router.navigate(['/properties'])
        },
        error: (error) => {
          console.error('error reserving property:', error);
        }
      });
    }
  }

  private getDuration(start: Date, end: Date) {
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private calculatePrice(start: Date, end: Date) {
    for (let i = new Date(start); i < new Date(end); i.setDate(i.getDate() + 1)) {
      let month = i.getMonth() + 1
      if (month >= 5 && month <= 8) {
        this.totalPrice += this.property.pricing.summer
      }
      else {
        this.totalPrice += this.property.pricing.winter
      }
    }
  }
}
