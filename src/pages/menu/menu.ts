import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';

import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';

@IonicPage({})
@Component({
	selector: 'page-menu',
	templateUrl: 'menu.html',
})
export class MenuPage {

	homePage: Component;
	WooCommerce: any;
	categories: any[];
	@ViewChild('content') childNavCtrl: NavController;
	loggedIn: boolean;
	user: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController, private events: Events) {
		this.homePage = 'HomePage';
		this.categories = [];
		this.user = {};

		this.WooCommerce = WC({
			url: "http://woo.modernconceptbuilders.com",
			consumerKey: "ck_2e1a60e4cdc45f0fea84b4a771ea96081745adcc",
			consumerSecret: "cs_2846df38b4e763efeac3700d643fcf78c5762eb6"
		});


		this.WooCommerce.getAsync("products/categories").then((data) => {
			console.log(JSON.parse(data.body).product_categories);

			let temp: any[] = JSON.parse(data.body).product_categories;

			for (let i = 0; i < temp.length; i++) {
				if (temp[i].parent == 0) {

					if (temp[i].slug == "clothing") {
						temp[i].icon = "shirt";
					}
					if (temp[i].slug == "music") {
						temp[i].icon = "musical-notes";
					}
					if (temp[i].slug == "posters") {
						temp[i].icon = "images";
					}

					this.categories.push(temp[i]);
				}
			}

		}, (err) => {
			console.log(err)
		});

		this.events.subscribe("updateMenu", () => {
			this.storage.ready().then(() => {
				this.storage.get("userLoginInfo").then((userLoginInfo) => {

					if (userLoginInfo != null) {

						console.log("User logged in...");
						this.user = userLoginInfo.user;
						console.log(this.user);
						this.loggedIn = true;
					}
					else {
						console.log("No user found.");
						this.user = {};
						this.loggedIn = false;
					}
				})
			});
		})
	}

	ionViewDidEnter() {

		this.storage.ready().then(() => {
			this.storage.get("userLoginInfo").then((userLoginInfo) => {

				if (userLoginInfo != null) {

					console.log("User logged in...");
					this.user = userLoginInfo.user;
					console.log(this.user);
					this.loggedIn = true;
				}
				else {
					console.log("No user found.");
					this.user = {};
					this.loggedIn = false;
				}

			})
		})
	}

	openCategoryPage(category) {
		this.childNavCtrl.setRoot('ProductsByCategoryPage', { "category": category });

	}

	openPage(pageName: string) {
		if (pageName == "signup") {
			this.navCtrl.push('SignupPage');
		}
		if (pageName == "login") {
			this.navCtrl.push('LoginPage');
		}
		if (pageName == 'logout') {
			this.storage.remove("userLoginInfo").then(() => {
				this.user = {};
				this.loggedIn = false;
			})
		}
		if (pageName == 'cart') {
			let modal = this.modalCtrl.create("CartPage");
			modal.present();
		}
	}
}
