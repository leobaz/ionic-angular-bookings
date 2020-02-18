import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    // tslint:disable: max-line-length
    new Place('p1', 'Manhattan Mansion', 'In the heart of New York City', 'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg', 149.99, new Date('2020-01-01'), new Date('2020-12-31'), 'abc'),
    new Place('p2', 'Amout Toujours', 'A romantic place in Paris!', 'https://bookshow.blurb.com/bookshow/cache/P6962858/md/cover_2.jpeg?access_key=e6c584bd77543d0e64145e7e269d44cb', 189.99, new Date('2020-01-01'), new Date('2020-12-31'), 'abc'),
    new Place('p3', 'The Foggy Place', 'Not your average city trip!', 'https://www.worldatlas.com/r/w728-h425-c728x425/upload/c8/d7/68/shutterstock-121582312.jpg', 89.99, new Date('2020-01-01'), new Date('2020-12-31'), 'abc')
  ]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) { }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return {...places.find(
        p => p.id === id
      )};
    }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(Math.random().toString(), title, description, 'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg', price, dateFrom, dateTo, this.authService.userId);
    this.places.pipe(take(1)).subscribe(places => {
      this._places.next(places.concat(newPlace));
    });
  }
}
