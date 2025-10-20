import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

    private userService = inject(UserService)
    private router = inject(Router)

    username = ""
    password = ""
    message = ""

    login() {
      this.userService.adminLogin(this.username, this.password).subscribe({
        next: (user) => {
            localStorage.setItem("logged", JSON.stringify(user))
            localStorage.setItem("type", user.type)
            this.userService.setLogged(true)
            this.userService.setType(user.type)
            this.router.navigate(['admin'])
            this.message = ""
        },
        error: (err) => {
          switch (err.status) {
            case 404:
              this.message = "korisnik ne postoji ili nalog ceka na odobrenje";
              break;
            case 401:
              this.message = "pogresna lozinka";
              break;
            case 500:
              this.message = "server error";
              break;
            default:
              this.message = "greska";
          }
        }
      })
    }
}
