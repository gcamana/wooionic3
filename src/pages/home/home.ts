import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides, ToastController } from 'ionic-angular';

import * as WC from 'woocommerce-api';
import { WooCommerceProvider } from '../../providers/woocommerce/woocommerce';

@IonicPage({})
@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	WooCommerce: any;
	products: any[];
	moreProducts: any[];
	page: number;
	searchQuery: string = "";

	@ViewChild('productSlides') productSlides: Slides;

	constructor(
		public navCtrl: NavController,
		public toastCtrl: ToastController,
		private woocommerce: WooCommerceProvider
	) {

		this.page = 2;

		this.WooCommerce = WC({
			url: "http://woo.modernconceptbuilders.com",
			consumerKey: "ck_2e1a60e4cdc45f0fea84b4a771ea96081745adcc",
			consumerSecret: "cs_2846df38b4e763efeac3700d643fcf78c5762eb6"
		});

		this.loadMoreProducts(null);

		this.WooCommerce.getAsync("products").then((data) => {
			console.log(JSON.parse(data.body));
			this.products = JSON.parse(data.body).products;
		}, (err) => {
			console.log(err)
		});

	}

	ionViewDidLoad() {
		setInterval(() => {

			if (this.productSlides.getActiveIndex() == this.productSlides.length() - 1)
				this.productSlides.slideTo(0);

			this.productSlides.slideNext();
		}, 3000)
	}

	loadMoreProducts(event) {
		console.log(event);
		if (event == null) {
			this.page = 2;
			this.moreProducts = [];
		}
		else
			this.page++;

		this.WooCommerce.getAsync("products?page=" + this.page).then((data) => {
			console.log(JSON.parse(data.body));
			this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);

			if (event != null) {
				event.complete();
			}

			if (JSON.parse(data.body).products.length < 10) {
				event.enable(false);

				this.toastCtrl.create({
					message: "No more products!",
					duration: 5000
				}).present();

			}
		}, (err) => {
			console.log(err)
		})
	}

	openProductPage(product) {
		this.navCtrl.push('ProductDetailsPage', { "product": product });
	}

	onSearch(event) {
		if (this.searchQuery.length > 0) {
			this.navCtrl.push('SearchPage', { "searchQuery": this.searchQuery });
		}
	}
}
