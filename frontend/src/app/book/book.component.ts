import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '../services/property.service';
import { Property } from '../models/property';
import { User } from '../models/user';
import { Reservation } from '../models/reservation';
import { Router } from '@angular/router';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit, AfterViewInit {

  step1!: FormGroup
  step2!: FormGroup
  step = 1
  property!: Property
  totalPrice = 0
  message = ""
  logged!: User

  displayDateBeg: string = ''
  displayDateEnd: string = ''

  private fb = inject(FormBuilder)
  private propertyService = inject(PropertyService)
  private router = inject(Router)

  ngOnInit(): void {
    this.property = JSON.parse(localStorage.getItem('bookingProperty')!)
    this.logged = JSON.parse(localStorage.getItem('logged')!)

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

  ngAfterViewInit(): void {
    this.flatpickrInit();
  }

  flatpickrInit() {
    let today = new Date()
    if (today.getHours() < 14) {
      today.setHours(14, 0, 0, 0)
    }

    let startPicker: any
    let endPicker: any

    startPicker = flatpickr("#dateBeg", {
      enableTime: true,
      time_24hr: true,
      dateFormat: "Y-m-d H:i",
      minDate: "today",
      minTime: "14:00",
      onChange: (selectedDates, dateStr) => {
        let start = selectedDates[0];
        if (start) {
          this.step1.patchValue({ dateBeg: start.toISOString() })
          this.displayDateBeg = this.formatDate(start);

          let minEndDate = new Date(start);
          minEndDate.setDate((new Date(start)).getDate() + 1)
          minEndDate.setHours(10, 0, 0, 0);
          endPicker.set("minDate", minEndDate)
        }
      }
    })

    endPicker = flatpickr("#dateEnd", {
      enableTime: true,
      time_24hr: true,
      dateFormat: "Y-m-d H:i",
      minDate: "today",
      maxTime: "10:00",
      onChange: (selectedDates) => {
        let end = selectedDates[0];
        if (end) {
          this.step1.patchValue({ dateEnd: end.toISOString() })
          this.displayDateEnd = this.formatDate(end)
        }
      }
    })
  }

  nextStep() {
    if (this.step1.valid) {
      let { dateBeg, dateEnd } = this.step1.value
      this.totalPrice = this.calculatePrice(dateBeg, dateEnd)
      this.step = 2
    }
  }

  previousStep() {
    this.step = 1;
    setTimeout(() => {
      this.flatpickrInit();
    }, 0)
  }

  formatDate(date: Date): string {
    return date.toLocaleString('sr-RS', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
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
          alert('uspesno ste rezervisali vikendicu!') // umesto ovoga modal mozda nekad kao na register komponenti ako me ne bude mrzelo
          this.router.navigate(['/properties'])
        },
        error: (err) => {
          if (err.status === 409) {
            alert('vikendica je vec rezervisana u odabranom periodu')
          } else if (err.status === 406) {
            alert('vikendica je blokirana tokom odabranog perioda')
          } else {
            alert('greska')
          }
        }
      });
    }
  }

  private calculatePrice(start: Date, end: Date) : number {
    let totPrice = 0

    for (let i = new Date(start); i < new Date(end); i.setDate(i.getDate() + 1)) {
      let month = i.getMonth() + 1
      if (month >= 5 && month <= 8) {
        totPrice += this.property.pricing.summer
      }
      else {
        totPrice += this.property.pricing.winter
      }
    }
    return totPrice
  }
}
