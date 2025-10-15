import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private http = inject(HttpClient)
  private url = "http://localhost:4000/users"

  private loggedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('logged'))
  logged$ = this.loggedSubject.asObservable()

  private typeSubject = new BehaviorSubject<string>(localStorage.getItem('type') || "");
  type$ = this.typeSubject.asObservable();

  isLogged() {
    return this.loggedSubject.next(false)
  }

  setLogged(status: boolean) {
    this.loggedSubject.next(status)
  }

  setType(type: string) {
    this.typeSubject.next(type);
    localStorage.setItem('type', type);
  }

  getType() {
    return this.typeSubject.value;
  }

  login(u: string, p: string) {
    const data = {
      username: u,
      password: p
    }

    return this.http.post<User>(`${this.url}/login`, data)
  }

  register(user: User, file?: File | null) {
    const formData = new FormData();
    formData.append('user', JSON.stringify(user))

    if (file) {
      formData.append('pfp', file);
    }

    return this.http.post<string>(`${this.url}/register`, formData)
  }

  updateUser(user: User, file?: File | null) {
    const formData = new FormData();
    formData.append('user', JSON.stringify(user))

    if (file) {
      formData.append('pfp', file);
    }

    return this.http.post<User>(`${this.url}/updateUser`, formData)
  }

  changePassword(username: string, oldPassword: string, newPassword: string) {
    const data = {
      username: username,
      oldPassword: oldPassword,
      newPassword: newPassword
    }

    return this.http.post<string>(`${this.url}/changePassword`, data)
  }

  
}
