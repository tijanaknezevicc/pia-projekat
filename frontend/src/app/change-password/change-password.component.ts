import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {


  private userService = inject(UserService)
  private router = inject(Router)

  oldPassword = ""
  newPassword = ""
  newPassword1 = ""
  message = ""

  changePassword() {

    let username = JSON.parse(localStorage.getItem('logged')!).username

    this.userService.changePassword(username, this.oldPassword, this.newPassword).subscribe({
      next: (data) => {
        this.message = "lozinka je promenjena"
        localStorage.clear()
        this.userService.setLogged(false)
        this.userService.setType("")
        this.router.navigate(['/login'])
      },
      error: (error) => {
        switch (error.status) {
          case 401:
            this.message = "pogresna stara lozinka"
            break;
          case 500:
            this.message = "server error"
            break;
          default:
            this.message = "greska"
        }
      }
    })
  }


}
