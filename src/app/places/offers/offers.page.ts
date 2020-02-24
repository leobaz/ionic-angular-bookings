import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { IonItemSliding } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  loadedOffers: Place[];
  private placesSub: Subscription;

  constructor(private placesService: PlacesService, private router: Router) {
    // router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.ngOnInit();
    //   }
    // });

   }

  ngOnInit() {
     this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedOffers = places;
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
