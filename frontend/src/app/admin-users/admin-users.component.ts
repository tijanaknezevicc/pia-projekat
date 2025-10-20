import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {

  userService = inject(UserService)

  pending: User[] = []
  approved: User[] = []
  backendUrl: string = "http://localhost:4000/assets/"
  timestamp: number = Date.now()
  selectedFile: File | null = null
  message = ""

  ngOnInit() {
    this.userService.getAllUsers().subscribe(data => {
      this.pending = data.filter(user => user.approved === false && user.type !== 'admin')
      this.approved = data.filter(user => user.approved === true && user.type !== 'admin')
    })
  }

  onFileSelect(event: any) {
    const file: File = event.target.files[0]
    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      if (img.width < 100 || img.height < 100 || img.width > 300 || img.height > 300) {
        alert('slika mora biti izmedju 100x100 i 300x300 px')
        this.selectedFile = null
      } else {
        this.selectedFile = file
        this.message = ''
      }
      URL.revokeObjectURL(objectUrl)
    }

    img.src = objectUrl;
  }

  removePfp(user: User) {
    user.pfp = "default.png"
    this.selectedFile = null
    this.message = ''
  }

  approveUser(user: User) {
    this.userService.approveUser(user).subscribe(ok => {
      alert('korisnik prihvacen')
      this.ngOnInit()
    })
  }

  rejectUser(user: User) {
    this.userService.rejectUser(user).subscribe(ok => {
      alert('korisnik odbijen')
      this.ngOnInit()
    })
  }

  toggleActive(user: User) {
    this.userService.toggleActiveStatus(user).subscribe(ok => {
      if (!user.active) alert('korisnik aktiviran')
      else alert('korisnik deaktiviran')
      this.ngOnInit()
    })
  }

  updateUser(user: User) {
    this.userService.updateUser(user, this.selectedFile).subscribe({
      next: (data) => {
        this.message = ""
        user = data
        this.timestamp = Date.now()
        alert('korisnik azuriran')
        this.ngOnInit()
      },
      error: (err) => {
        if (err.status === 400) {
          alert('email vec postoji u bazi')
          this.ngOnInit()
        }
        else if (err.status === 500) {
          alert('server error')
          this.ngOnInit()
        }
        else {
          alert('greska')
          this.ngOnInit()
        }
      }
    })
  }

}
