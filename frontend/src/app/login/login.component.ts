import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private userService = inject(UserService)
  private router = inject(Router)

  username = ""
  password = ""
  message = ""

  login() {
    this.userService.login(this.username, this.password).subscribe(user => {
      if (user) {
        localStorage.setItem("logged", JSON.stringify(user))
        this.userService.setLogged(true)
        this.router.navigate([user.type])
        this.message = ""
      }
      else {
        this.message = "greska: pogresno korisnicko ime ili lozinka!"
      }
    })
  }
}
