import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { LoginComponent } from './login/login.comp';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  //{ path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'login',  component: LoginComponent },
  { path: '', loadChildren: './modules#ModuleModule'},
  { path: '**',    component: NoContentComponent },
];
