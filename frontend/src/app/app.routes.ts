import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminComponent } from './admin/admin.component';
import { OwnerComponent } from './owner/owner.component';
import { TouristComponent } from './tourist/tourist.component';
import { GuestComponent } from './guest/guest.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

export const routes: Routes = [
  {path: "", component: GuestComponent},
  {path: "login", component: LoginComponent},
  {path: "admin-login", component: AdminLoginComponent},
  {path: "admin", component: AdminComponent},
  {path: "owner", component: OwnerComponent},
  {path: "tourist", component: TouristComponent},
  {path: "register", component: RegisterComponent},
  {path: "profile", component: ProfileComponent},
  {path: "change-password", component: ChangePasswordComponent},
];
