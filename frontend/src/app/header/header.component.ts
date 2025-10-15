import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbModule, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  ngOnInit(): void {
    this.userService.logged$.subscribe(status => {
      this.isLogged = status
    })
    this.userService.type$.subscribe(type => {
      this.type = type
    })
  }

  isCollapsed = true;
  isLogged = false;
  type = ""

  private router = inject(Router)
  private userService = inject(UserService)

  goTo(action: string) {
    this.router.navigate([action])
  }

  logout() {
    localStorage.clear()
    this.userService.setLogged(false)
    this.userService.setType("")
    this.router.navigate([""])
  }

  changePassword() {
    this.router.navigate(["change-password"])
  }
}
