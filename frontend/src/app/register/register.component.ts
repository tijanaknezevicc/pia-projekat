import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

declare var bootstrap: any

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private userService = inject(UserService)
  private router = inject(Router)

  user: User = new User()
  message = ""
  cardType: string | null = null

  register() {
    this.userService.register(this.user).subscribe({

      next: (data) => {
        this.message = ""
        this.router.navigate([""])
        this.showModal()
      },
      error: (err) => {
        if (err.status === 400) {
          this.message = 'email vec postoji u bazi';
        }
        else if (err.status === 500) {
          this.message = 'server error';
        }
        else {
          this.message = 'greska';
        }
      }
    })
  }

  showModal() {
    const modalElement = document.getElementById('registerAlert');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  continue() {
    this.router.navigate([""])
    }

  onFileSelect(arg0: any) {
    throw new Error('Method not implemented.')
  }


  formatCardNumber(event: any) {
    let input = event.target.value.replace(/\D/g, '')

    if (/^(300|301|302|303|36|38)/.test(input)) {
      input = input.substring(0, 15)
      input = input.replace(/^(\d{4})(\d{0,7})(\d{0,4})/, '$1 $2 $3')
      }

    else {
      input = input.replace(/(.{4})/g, '$1 ').trim()
    }

    event.target.value = input;
    this.user.payment = input;
    this.detectCardType(input.replace(/\s/g, ''))

    if (!this.cardType) {
      this.user.payment = '';
    }
  }

  detectCardType(value: string) {
    if (/^(4539|4556|4916|4532|4929|4485|4716,)/.test(value)) {
      this.cardType = 'assets/cards/visa.png'
    } else if (/^5[1-5]/.test(value)) {
      this.cardType = 'assets/cards/mastercard.png'
    } else if (/^(36|38|300|301|302|303)/.test(value)) {
      this.cardType = 'assets/cards/diners.png';
    } else {
      this.cardType = null
    }
  }
}
