import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerEntryComponent } from './customer-entry/customer-entry.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './auth/login.guard';

const routes: Routes = [
  {
    path: "", redirectTo: 'login', pathMatch: 'full',
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: "list", component: CustomerListComponent, canActivate: [LoginGuard]
  },
  {
    path: 'entry', component: CustomerEntryComponent, canActivate: [LoginGuard]
  }, 
  {
    path: 'view', component: CustomerViewComponent, canActivate: [LoginGuard]
  },
  {
    path: "**", component: LoginComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
