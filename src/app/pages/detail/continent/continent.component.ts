import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ContinentsService} from '../../../services/continents.service';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';


interface Continent {
  country: string;
  continent: string;
}

interface MapData {
  name: string;
  import: boolean;
  export: boolean;
  country: string;
  note: string;
}

interface UserContinents {
  name: string;
  code: string;
  continent: string;
  type: string;
  note: string;
}

@Component({
  selector: 'app-continent',
  templateUrl: './continent.component.html',
  styleUrls: ['./continent.component.scss']
})
export class ContinentComponent implements OnInit, OnDestroy {

  param: any;
  userContinentCountries: UserContinents[] = [];
  countries: any;
  icons: any = {faArrowLeft};
  text = '';

  constructor(private route: ActivatedRoute, public continentService: ContinentsService) {
    route.params.subscribe(val => {
      this.param = this.route.snapshot.paramMap.get('id');
    });
  }

  getUserId(): any {
    const appUser = localStorage.getItem('appUser');
    if (appUser !== null && appUser !== '') {
      return JSON.parse(appUser).data.id;
    }
  }

  ngOnInit(): void {
    let userData: any = localStorage.getItem('userData');
    if (userData !== null) {
      userData = JSON.parse(userData);
      userData = userData.find((u: any) => u.userId === this.getUserId());
      if (userData !== undefined) {
        this.userContinentCountries = userData.data;

        this.continentService.getContinentsCountry().subscribe((r: any) => {
          this.countries = r;

          this.userContinentCountries.forEach((item: any) => {
            this.countries.forEach((countriesItem: any) => {
              if (countriesItem.country === item.name) {
                item.continent = countriesItem.continent;
              }
            });
          });
        });
      }
    }
  }// ngOnInıt End

  // make sure to destory the editor
  ngOnDestroy(): void {
  }
}
