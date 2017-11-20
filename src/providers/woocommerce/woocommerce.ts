import { Injectable } from '@angular/core';
import * as WC from 'woocommerce-api';

@Injectable()
export class WooCommerceProvider {

  WooCommerce: any;

  constructor() {
    this.WooCommerce = WC({
      url: "http://woo.modernconceptbuilders.com",
			consumerKey: "ck_2e1a60e4cdc45f0fea84b4a771ea96081745adcc",
			consumerSecret: "cs_2846df38b4e763efeac3700d643fcf78c5762eb6"
    });
  }

  initialize(){
    return this.WooCommerce;
  }

}
