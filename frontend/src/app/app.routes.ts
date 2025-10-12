import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "user", component: UserComponent},
  {path: "admin-login", component: AdminLoginComponent},
  {path: "admin", component: AdminComponent}
];
