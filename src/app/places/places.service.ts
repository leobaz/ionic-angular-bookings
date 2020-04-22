import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, concat, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
// tslint:disable: max-line-length

// [
//
//     new Place('p1', 'Manhattan Mansion', 'In the heart of New York City', 'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg', 149.99, new Date('2020-01-01'), new Date('2020-12-31'), 'xyz'),
//     new Place('p2', 'Amout Toujours', 'A romantic place in Paris!', 'https://bookshow.blurb.com/bookshow/cache/P6962858/md/cover_2.jpeg?access_key=e6c584bd77543d0e64145e7e269d44cb', 189.99, new Date('2020-01-01'), new Date('2020-12-31'), 'abc'),
//     new Place('p3', 'The Foggy Place', 'Not your average city trip!', 'https://www.worldatlas.com/r/w728-h425-c728x425/upload/c8/d7/68/shutterstock-121582312.jpg', 89.99, new Date('2020-01-01'), new Date('2020-12-31'), 'abc')
// ]

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    return this.http.get<{ [key: string]: PlaceData }>('https://ionic-angular-bookings-531f1.firebaseio.com/offered-places.json').pipe(map(data => {
      const places = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          places.push(new Place(
            key,
            data[key].title,
            data[key].description,
            data[key].imageUrl,
            data[key].price,
            new Date(data[key].availableFrom),
            new Date(data[key].availableFrom),
            data[key].userId
            ));
        }
      }
      return places;
    }),
    tap(places => {
      this._places.next(places);
    }));
  }

  getPlace(id: string) {
    return this.http.get<PlaceData>(`https://ionic-angular-bookings-531f1.firebaseio.com/offered-places/${id}.json`).pipe(map(data => {
      return new Place(
        id,
        data.title,
        data.description,
        data.imageUrl,
        data.price,
        new Date(data.availableFrom),
        new Date(data.availableTo),
        data.userId
        );
    }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title, description,
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
      );
    return this.http.post<{name: string}>('https://ionic-angular-bookings-531f1.firebaseio.com/offered-places.json', { ...newPlace, id: null }).pipe(switchMap(data => {
      generatedId = data.name;
      return this.places;
    }),
    take(1),
    tap(places => {
      newPlace.id = generatedId;
      this._places.next(places.concat(newPlace));
    }));
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(take(1), switchMap(places => {
      if (!places || places.length <= 0) {
        return this.fetchPlaces();
      } else {
        return of(places);
      }
    }),
     switchMap(places => {
      const updatedPlaceIndex = places.findIndex(
        pl => pl.id === placeId
      );
      updatedPlaces = [...places];
      const oldPlace = updatedPlaces[updatedPlaceIndex];
      updatedPlaces[updatedPlaceIndex] = new Place(
        oldPlace.id,
        title,
        description,
        oldPlace.imageUrl,
        oldPlace.price,
        oldPlace.availableFrom,
        oldPlace.availableTo,
        oldPlace.userId
        );
      return this.http.put(`https://ionic-angular-bookings-531f1.firebaseio.com/offered-places/${placeId}.json`, {...updatedPlaces[updatedPlaceIndex], id: null});
    }), tap(() => {
      this._places.next(updatedPlaces);
    }));
  }
}
