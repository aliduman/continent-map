import {Component, OnInit} from '@angular/core';
import {SocialAuthService} from 'angularx-social-login';
import {GoogleLoginProvider} from 'angularx-social-login';
import {faFacebook, faGoogle} from '@fortawesome/free-brands-svg-icons';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public icons: any = {faFacebook, faGoogle};

  constructor(private authService: SocialAuthService, private route: ActivatedRoute,
              private router: Router) {
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  ngOnInit(): void {
    const appUser = localStorage.getItem('appUser');
    if (appUser != null && appUser !== '') {
      this.router.navigate(['detail/map']);
    }
    this.authService.authState.subscribe((user) => {
      if (user != null) {
        localStorage.setItem('appUser', JSON.stringify({data: user}));
        this.router.navigate(['detail/map']);
      }
    });
  }

}
