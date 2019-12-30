import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onBookPlace() {
    this.router.navigateByUrl('/places/tabs/discover');
  }

}
