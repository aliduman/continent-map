import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoginComponent} from './pages/login/login.component';
import {ContinentComponent} from './pages/detail/continent/continent.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {DetailComponent} from './pages/detail/detail.component';
import {MapComponent} from './pages/detail/map/map.component';
import {HttpClientModule} from '@angular/common/http';
import {SocialLoginModule, SocialAuthServiceConfig} from 'angularx-social-login';
import {
  GoogleLoginProvider,
} from 'angularx-social-login';
import { LogoutComponent } from './pages/logout/logout.component';
import {FormsModule} from '@angular/forms';
import {AceEditorModule} from 'ng2-ace-editor';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContinentComponent,
    DetailComponent,
    MapComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    HttpClientModule,
    SocialLoginModule,
    FormsModule,
    AceEditorModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '74770370355-7kuc6hhrbufkt9umsn2nd9ie5e0fgeti.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
