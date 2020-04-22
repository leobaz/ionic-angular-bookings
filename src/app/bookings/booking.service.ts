import {Injectable} from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject, concat } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, delay, tap, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
// tslint:disable: max-line-length

interface BookingData {
    bookedFrom: string;
    bookedTo: string;
    firstName: string;
    guestNumber: number;
    lastName: string;
    placeId: string;
    placeImage: string;
    placeTitle: string;
    userId: string;
}

@Injectable({providedIn: 'root'})
export class BookingService {
    private _bookings = new BehaviorSubject<Booking[]>([]);

    get bookings() {
        return this._bookings.asObservable();
    }

    constructor(private authService: AuthService, private httpClient: HttpClient) {

    }

    addBooking(placeId: string, placeTitle: string, placeImage: string, firstName: string, lastName: string, guestNumber: number, dateFrom: Date, dateTo: Date) {
        let generatedId = '';
        const newBooking = new Booking(Math.random().toString(), placeId, this.authService.userId, placeTitle, placeImage, firstName, lastName, guestNumber, dateFrom, dateTo);
        return this.httpClient.post<{name: string}>('https://ionic-angular-bookings-531f1.firebaseio.com/bookings.json', {...newBooking, id: null})
        .pipe(switchMap(resData => {
            generatedId = resData.name;
            return this.bookings;
        }),
        take(1),
        tap(bookings => {
            newBooking.id = generatedId;
            this._bookings.next(bookings.concat(newBooking));
        }));
    }

    cancelBooking(bookingId: string) {
        return this.httpClient.delete(`https://ionic-angular-bookings-531f1.firebaseio.com/bookings/${bookingId}.json`).pipe(switchMap(() => {
            return this.bookings;
        }), take(1), tap(bookings => {
            this._bookings.next(bookings.filter(b => b.id !== bookingId));
        }));
    }

    fetchBookings() {
        return this.httpClient.get<{ [key: string]: BookingData }>(`https://ionic-angular-bookings-531f1.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`).pipe(map(bookingData => {
            const bookings = [];
            for (const key in bookingData) {
                if (bookingData.hasOwnProperty(key)) {
                    bookings.push(
                        new Booking(
                            key,
                            bookingData[key].placeId,
                            bookingData[key].userId,
                            bookingData[key].placeTitle,
                            bookingData[key].placeImage,
                            bookingData[key].firstName,
                            bookingData[key].lastName,
                            bookingData[key].guestNumber,
                            new Date(bookingData[key].bookedFrom),
                            new Date(bookingData[key].bookedTo)
                        )
                    );
                }
            }
            return bookings;
        }),
        tap(bookings => {
            this._bookings.next(bookings);
        })
        );
    }
}