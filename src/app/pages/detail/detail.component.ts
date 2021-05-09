import {Component, OnInit} from '@angular/core';
import {ContinentsService} from '../../services/continents.service';
import {debounceTime, delay, distinct, distinctUntilChanged, map} from 'rxjs/operators';
import {flatMap} from 'rxjs/internal/operators';
import {from, Observable, OperatorFunction} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {faSearch, faSign} from '@fortawesome/free-solid-svg-icons';
import {SocialAuthService, SocialUser} from 'angularx-social-login';


interface Key {
  key: string;
}

interface Countries {
  code: string;
  name: string;
  selected: string;
  out: string;
  in: string;
  note: string;
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  title = 'continents-map';
  icons = {faSearch, faSign};
  private countries: any[] = [];
  public model: any;
  loggedIn = false;
  user: SocialUser | undefined;


  search: OperatorFunction<string, readonly { name: Countries }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 3 ? []
        : this.countries.filter((v: any) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  formatter = (x: Countries) => {
    return x.name;
  };

  constructor(private authService: SocialAuthService,
              private route: ActivatedRoute,
              private router: Router,
              private continentService: ContinentsService) {
  }

  ngOnInit(): void {
    this.continentService.getCountries().subscribe((result: any[]) => {
      this.countries = result;
    });
    // Get user storage data
    const lsData = localStorage.getItem('appUser');
    if (lsData != null) {
      this.user = JSON.parse(lsData).data;
      this.loggedIn = true;
    }

  }

  public enterSearch(e: Key): any {
    if (e.key === 'Enter') {
      this.searchcontinent();
    }
  }

  signOut(): void {
    this.user = undefined;
    this.loggedIn = false;
    this.authService.signOut();
    localStorage.removeItem('appUser');
    this.router.navigate(['logout']);
  }

  public searchcontinent(): void {
    this.router.navigate(['/detail/map/', this.model.name.toString()]);
  }


}
