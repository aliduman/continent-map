import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {AuthGuard} from './auth.guard';
import {DetailComponent} from './pages/detail/detail.component';
import {ContinentComponent} from './pages/detail/continent/continent.component';
import {LogoutComponent} from './pages/logout/logout.component';
import {MapComponent} from './pages/detail/map/map.component';

const routes: Routes = [
  {
    component: DetailComponent,
    path: 'detail',
    canActivate: [AuthGuard],
    children: [
      {
        component: MapComponent,
        path: 'map/:country',
      },
      {
        component: MapComponent,
        path: 'map',
      },
      {
        component: ContinentComponent,
        path: 'continent/:id',
      },
      {
        component: ContinentComponent,
        path: 'continent',
      },
    ]
  },
  {
    component: LoginComponent,
    path: 'login',
    canActivate: [AuthGuard]
  },
  {
    component: LogoutComponent,
    path: 'logout',
  },
  {
    path: '**',
    component: LoginComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
