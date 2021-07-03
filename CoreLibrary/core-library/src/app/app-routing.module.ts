import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './core/services/auth-guard.service';
import { AuthenticationService } from './core/services/authentication.service';
import { AdministrationComponent } from './pages/administration/administration.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { OauthComponent } from './pages/oauth/oauth.component';
import { SampleChartsComponent } from './pages/sample-charts/sample-charts.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
  { path: 'oauth', component: OauthComponent },
  { path: 'administration', component: AdministrationComponent, canActivate: [AuthGuardService] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'sample-charts', component: SampleChartsComponent, canActivate: [AuthGuardService] },
  {
    path: 'animations',
    loadChildren: () => import('./pages/animations/animations-routing.module').then(m => m.AnimationsRoutingModule),
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuardService, AuthenticationService],
  exports: [RouterModule]
})
export class AppRoutingModule { }
