import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place('p1', 'Manhattan Mansion', 'In the heart of New York City', 'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg', 149.99),
    new Place('p2', 'Amout Toujours', 'A romantic place in Paris!', 'https://bookshow.blurb.com/bookshow/cache/P6962858/md/cover_2.jpeg?access_key=e6c584bd77543d0e64145e7e269d44cb', 189.99),
    new Place('p3', 'The Foggy Place', 'Not your average city trip!', 'https://www.worldatlas.com/r/w728-h425-c728x425/upload/c8/d7/68/shutterstock-121582312.jpg', 89.99)
  ];

  get places() {
    return [...this._places];
  }

  constructor() { }

  getPlace(id: string) {
    return {...this.places.find(
      p => p.id === id
    )};
  }
}
