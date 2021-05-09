import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ContinentsService {

  constructor(private http: HttpClient) {
  }

  getContinents(): any {
    return this.http.get('/assets/continents.json');
  }

  getContinentsCountry(): any {
    return this.http.get('/assets/continents_country.json');
  }

  getCountries(): any {
    return this.http.get('/assets/countries.json');
  }
}
