import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminComponent } from './admin/admin.component';
import { GuestComponent } from './guest/guest.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PropertiesComponent } from './properties/properties.component';
import { MyPropertiesComponent } from './my-properties/my-properties.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { StatsComponent } from './stats/stats.component';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { BookComponent } from './book/book.component';
import { RateComponent } from './rate/rate.component';

export const routes: Routes = [
  {path: "", component: GuestComponent},
  {path: "login", component: LoginComponent},
  {path: "admin-login", component: AdminLoginComponent},
  {path: "admin", component: AdminComponent},
  {path: "owner", component: ProfileComponent},
  {path: "tourist", component: ProfileComponent},
  {path: "register", component: RegisterComponent},
  {path: "change-password", component: ChangePasswordComponent},
  {path: "properties", component: PropertiesComponent},
  {path: "my-properties", component: MyPropertiesComponent},
  {path: "reservations", component: ReservationsComponent},
  {path: "stats", component: StatsComponent},
  {path: "property-details/:name", component: PropertyDetailsComponent},
  {path: "book-property", component: BookComponent},
  {path: "rate-property/:name", component: RateComponent},
];
