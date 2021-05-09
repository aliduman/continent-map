import {Component, Input, OnInit} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {ContinentsService} from '../../../services/continents.service';
import {faSave} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute} from '@angular/router';

interface Continent {
  continent: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  countryNameInput: string | undefined;
  icons: any = {faSave};
  contextMenuState = false;
  contextMenuStyle: any = {
    display: 'none',
    top: 0,
    left: 0,
    fill: '#cbcbcb'
  };
  selectedPath: any;
  selectedCountries: any = [];
  countries: any = [];
  note = '';
  data = {
    id: '',
    name: '',
    code: '',
    type: '',
    note: '',
    continent: '',
  };
  userData: any = {
    userId: '',
    data: []
  };
  continents: any = [];
  countryCount = 0;
  importedPercent = 0;
  exportedPercent = 0;

  constructor(private route: ActivatedRoute,
              private modalService: NgbModal,
              private continentService: ContinentsService) {
  }

  getUserId(): any {
    const appUser = localStorage.getItem('appUser');
    if (appUser !== null && appUser !== '') {
      return JSON.parse(appUser).data.id;
    }
  }

  setIEPercents(): void {
    const filterUserData = this.getUserData();
    let exportCount: any = 0;
    let importCount: any = 0;

    if (filterUserData !== undefined && filterUserData !== null && filterUserData !== '') {
      filterUserData.data.forEach((item: any) => {
        if (item.type === 'export') {
          exportCount++;
        }
        if (item.type === 'import') {
          importCount++;
        }
        this.importedPercent = this.countryCount / 100 * importCount;
        this.exportedPercent = this.countryCount / 100 * exportCount;
      });
    }
  }

  getUserData(): any {
    // Initilize storage data
    let filterUserData: any = [];
    const activeUserId = this.getUserId();
    const userData = localStorage.getItem('userData');
    if (userData !== null && userData !== '') {
      // user data check...
      const userParseData = JSON.parse(userData);
      if (userParseData !== null && userParseData !== undefined && userParseData.length > 0) {
        filterUserData = userParseData.find((d: any) => d.userId === activeUserId);
      }
    }
    return filterUserData;
  }

  ngOnInit(): void {
    this.userData.userId = this.getUserId();
    // Kıta listesi için çağırıyoruz.
    this.continentService.getContinents().subscribe((response: Continent) => {
      this.continents = response;
    });

    const pathElem = document.querySelectorAll('path');

    // Sayfa yenilenmeden route parametresi değiştiğinde subscribe oluyoruz.
    this.route.params.subscribe(val => {
      this.countryNameInput = val.country;
      this.continentService.getCountries().subscribe((result: any) => {
        this.countries = result;
        this.countryCount = result.length;
        this.setIEPercents();
        this.countries.forEach((countryItem: any) => {
          pathElem.forEach((pathItem) => {
            const idCode = pathItem.getAttribute('id');
            if (countryItem.code === idCode) {
              pathItem.setAttribute('class', countryItem.name);
            }
            if (this.countryNameInput === pathItem.getAttribute('class')) {
              pathItem.setAttribute('data-selected', 'true');
              pathItem.style.fill = 'orange';
            } else {
              pathItem.style.fill = '#cbcbcb';
            }
          });
        });

        const filterUserData = this.getUserData();
        if (filterUserData !== undefined && filterUserData !== null && filterUserData !== '') {
          this.selectedCountries = filterUserData.data;
          this.selectedCountries.forEach((countryItem: any) => {
            pathElem.forEach((pathItem) => {
              // Map in country name value
              const className = pathItem.getAttribute('class');
              if (countryItem.name === className) {
                let selectedColor = '#cbcbcb';
                if (countryItem.type === 'import') {
                  selectedColor = 'red';
                } else {
                  selectedColor = 'green';
                }
                pathItem.style.fill = selectedColor;
                pathItem.setAttribute('data-selected', 'true');
              }
            });
          });
        }

      });
    });
  }

  onRightClick(e: any, data: any): any {
    e.preventDefault();
    this.selectedPath = e.target;
    this.contextMenuStyle.display = 'block';
    this.contextMenuStyle.top = e.pageY + 'px';
    this.contextMenuStyle.left = e.pageX + 'px';
    if (e.target.getAttribute('data-selected') !== 'true') {
      e.target.style.fill = 'black';
    }

    const name = this.selectedPath.getAttribute('class');
    const code = this.selectedPath.getAttribute('id');
    const index = this.selectedCountries.findIndex((s: any) => s.name === name);
    if (index > -1) {
      this.data = this.selectedCountries[index];
    } else {
      this.data = {
        id: '',
        name,
        code: code !== null ? code.toLowerCase() : '',
        type: '',
        note: '',
        continent: ''
      };
    }
  }

  mapPathColorChanged(color: string): void {
    const path = document.querySelectorAll('path');
    path.forEach((item) => {
      if (item.getAttribute('class') === this.data.name) {
        item.style.fill = color;
        item.setAttribute('data-selected', 'true');
      }
    });
  }

  countryImport(): void {
    this.data.type = 'import';
    this.mapPathColorChanged('red');
    this.updateCountryData();
    this.setIEPercents();
  }

  countryExport(): void {
    this.data.type = 'export';
    this.mapPathColorChanged('green');
    this.updateCountryData();
    this.setIEPercents();
  }

  countryNote(content: any): void {
    const addNote = () => {
      this.data.note = this.note;
      this.updateCountryData();
      this.note = '';
    };

    this.modalService
      .open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result
      .then((result) => {
        addNote();
      }, (reason) => {
        addNote();
      });

  }

  countryDelete(): void {
    const index = this.selectedCountries.findIndex((s: any) => s.name === this.data.name);

    // Silinen ülkenin renk stilini kaldırıyoruz.
    this.selectedPath.removeAttribute('style');
    this.selectedCountries.splice(index, 1);
    this.userData.userId = this.getUserId();
    this.userData.data = this.selectedCountries;
    this.updateCountryData();
  }

  updateCountryData(): void {
    this.contextMenuStyle.display = 'none';
    let index = -1;
    if (this.selectedCountries.length > 0) {
      index = this.selectedCountries.findIndex((s: any) => s.name === this.data.name);
    }
    if (index > -1) {
      this.selectedCountries[index] = this.data;
    } else {
      this.selectedCountries.push(this.data);
    }

    this.userData.userId = this.getUserId();
    this.userData.data = this.selectedCountries;

    let realData: any = [];
    let userData: any = localStorage.getItem('userData');
    if (userData !== null && userData !== '') {
      userData = JSON.parse(userData);
      if (typeof userData === 'object' && userData.length > 0) {
        const userDataControl = userData.find((dataItem: any) => dataItem.userId === this.userData.userId);
        if (userDataControl !== null && userDataControl !== undefined) {
          const userDataIndex = userData.findIndex((u: any) => u.userId === this.userData.userId);
          userData[userDataIndex].data = this.userData.data;
          realData = userData;
        } else {
          realData = [...userData, ...[this.userData]];
        }
      } else {
        realData = [this.userData];
      }
      localStorage.setItem('userData', JSON.stringify(realData));
    } else {
      localStorage.setItem('userData', JSON.stringify([this.userData]));
    }
  }

  outClick(): void {
    this.contextMenuStyle.display = 'none';
    const path = document.querySelectorAll('path');
    path.forEach((item) => {
      if (item.getAttribute('data-selected') !== 'true') {
        item.removeAttribute('style');
      }
    });
  }
}
