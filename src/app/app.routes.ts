import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';

import { LoginComponent } from './login/login.comp';
import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  { path: '', loadChildren: './modules#ModuleModule' },
  { path: 'master', loadChildren: './admin#AdminModule' },
  
  { path: '**', component: NoContentComponent },
];
