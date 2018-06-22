import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';

import { LoginComponent } from './login/login.comp';
import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: 'login', component: LoginComponent },

  { path: '', loadChildren: './modules#ModuleModule' },
  
  { path: '**', component: NoContentComponent },
];
