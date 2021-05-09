import {Component, OnInit} from '@angular/core';
import {faSearch, faSign} from '@fortawesome/free-solid-svg-icons';
import {GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of, OperatorFunction} from 'rxjs';
import {debounceTime, distinct, distinctUntilChanged, map} from 'rxjs/operators';
import {ContinentsService} from './services/continents.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
