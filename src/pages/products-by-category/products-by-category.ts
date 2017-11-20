import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as WC from 'woocommerce-api';

@IonicPage({})
@Component({
	selector: 'page-products-by-category',
	templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {

	WooCommerce: any;
	products: any[];
	page: number;
	category: any;

	constructor(public navCtrl: NavController, public navParams: NavParams) {

		this.page = 1;
		this.category = this.navParams.get("category");

		this.WooCommerce = WC({
			url: "http://woo.modernconceptbuilders.com",
			consumerKey: "ck_2e1a60e4cdc45f0fea84b4a771ea96081745adcc",
			consumerSecret: "cs_2846df38b4e763efeac3700d643fcf78c5762eb6"
		});


		this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug).then((data) => {
			console.log(JSON.parse(data.body));
			this.products = JSON.parse(data.body).products;
		}, (err) => {
			console.log(err)
		})

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ProductsByCategory');
	}

	loadMoreProducts(event) {
		this.page++;
		console.log("Getting page " + this.page);
		this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug + "&page=" + this.page).then((data) => {
			let temp = (JSON.parse(data.body).products);

			this.products = this.products.concat(JSON.parse(data.body).products)
			console.log(this.products);
			event.complete();

			if (temp.length < 10)
				event.enable(false);
		})
	}

	openProductPage(product) {
		this.navCtrl.push('ProductDetailsPage', { "product": product });
	}

}
