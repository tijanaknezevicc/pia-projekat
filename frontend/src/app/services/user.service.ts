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

  isLogged() {
    return this.loggedSubject.next(false)
  }

  setLogged(status: boolean) {
    this.loggedSubject.next(status)
  }

  login(u: string, p: string) {
    const data = {
      username: u,
      password: p
    }

    return this.http.post<User>(`${this.url}/login`, data)
  }

  register(u: User) {
    return this.http.post<string>(`${this.url}/register`, u)
  }
}
