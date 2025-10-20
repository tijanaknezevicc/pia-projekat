import { Component, inject, OnInit } from '@angular/core';
import { Reservation } from '../models/reservation';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-rate',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './rate.component.html',
  styleUrl: './rate.component.css'
})
export class RateComponent implements OnInit {

  reservation!: Reservation
  text = ""
  selectedRating = 0
  hoverRating = 0
  form!: FormGroup

  router = inject(Router)
  userService = inject(UserService)
  fb = inject(FormBuilder)


  ngOnInit(): void {
    this.reservation = JSON.parse(localStorage.getItem('reservation')!)

    this.form = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.maxLength(500)]]
    })
  }

  setRating(rating: number) {
    this.selectedRating = rating
    this.form.controls['rating'].setValue(rating)
  }

  addRating() {
    this.reservation.rating = this.form.value.rating
    this.reservation.comment = this.form.value.comment
    this.userService.addRating(this.reservation).subscribe(ok => {
      alert('ocena dodata')
      this.back()
    })

  }

  back() {
    localStorage.removeItem('reservation')
    this.router.navigate(['reservations'])
  }
}
