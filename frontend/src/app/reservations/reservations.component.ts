import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Reservation } from '../models/reservation';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit {

  userService = inject(UserService)
  router = inject(Router)

  type = ""
  user = new User()
  archived: Reservation[] = []
  current: Reservation[] = []
  pending: Reservation[] = []
  all: Reservation[] = []

  ngOnInit(): void {
    this.userService.type$.subscribe(type => {
      this.type = type
    })
    this.user = JSON.parse(localStorage.getItem('logged')!)
      if (this.type === 'owner') {
        this.userService.getReservationsOwner(this.user).subscribe(data => {
          this.all = data
          this.pending = this.all.filter(r => r.pending === true)
        })
      }
      else if (this.type === 'tourist') {
        this.userService.getReservationsTourist(this.user).subscribe(data => {
          this.all = data

          let now = new Date()
          this.archived = this.all.filter(r => new Date(r.dateEnd) < now)
          this.current = this.all.filter(r => new Date(r.dateEnd) >= now)
        })
      }
  }

  approve(reservation: Reservation) {
    reservation.approved = true
    reservation.rejectionReason = ""
    this.userService.processReservation(reservation).subscribe(ok => {
      alert("odobrena rezervacija")
      this.ngOnInit()
    })
  }

  reject(reservation: Reservation) {
    reservation.approved = false
    this.userService.processReservation(reservation).subscribe(ok => {
      alert("odbijena rezervacija")
      this.ngOnInit()
    })
  }

  canCancel(reservation: Reservation): boolean {
    let now = new Date()
    let dateBeg = new Date(reservation.dateBeg)
    let diff = dateBeg.getTime() - now.getTime()
    let diffInHours = diff / (1000 * 60 * 60)
    return diffInHours >= 24
  }

  cancelReservation(reservation: Reservation) {
    this.userService.cancelReservation(reservation).subscribe(response => {
      alert("otkazana rezervacija")
      this.ngOnInit()
    })
  }

  rate(reservation: Reservation) {
    localStorage.setItem('reservation', JSON.stringify(reservation))
    this.router.navigate(['/rate-property', reservation.propertyName])
  }
}
