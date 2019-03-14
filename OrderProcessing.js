import React from 'react';

import {auth} from "../../Firebase";

import { ShoppingCart } from './ShoppingCart'
import Checkout from './Checkout';
import { Shipment } from './Shipment';
import Payment from './Payment';
import LogIn from './LogIn';
import { ShoppingBar } from '../../ShoppingBar/ShoppingBar';

class OrderProcessing extends React.Component {
    constructor(props){
      super(props);
      this.state= {
        cart: false,
        checkout: false,
        shipment: false,
        payment: false,
      }

      this.checkout = this.checkout.bind(this);
      this.shipment = this.shipment.bind(this);
      this.payment = this.payment.bind(this);
      this.backToCart = this.backToCart.bind(this);
    };

    //changes the state show the checkout page is rendered
    //called from shopping cart page
    checkout = () => {
        this.setState({
            cart: false,
            checkout: true,
            shipment: false,
            payment: false,
        })
    };

    //changes the state show the shipment page is rendered
    //called from shopping cart page
    shipment = (subtotal) => {
        this.setState({
            cart: false,
            checkout: false,
            shipment: true,
            payment: false
        })
        this.props.updateSubtotal(subtotal)
    };

    //changes the state show the shipment page is rendered
    //called from shopping cart page
    payment = () => {
        this.setState({
            cart: false,
            checkout: false,
            shipment: false,
            payment: true
        })
    };

    //sends user back to cart
    //called from shopping cart page
    backToCart = () => {
        this.setState({
          cart: true,
          checkout: false,
          shipment: false,
          payment: false,
        })
    };

    componentDidMount (){
        this.listener = auth.onAuthStateChanged(user => {
          if (user){
            this.setState({
                cart: true,
                checkout: false,
                shipment: false,
                payment: false,
            })
          } else {
            this.setState ({
                cart: false,
                checkout: false,
                shipment: false,
                payment: false,
            })
          }
        })
    }

    render() {
        if(!this.state.cart && !this.state.checkout && !this.state.shipment && !this.state.payment){
            return (
                <section className="Content" id="Cart" onClick={this.props.releaseScroll}>
                    <div className="TranspBackground"></div>
                    <LogIn />
                </section>
            );
        } else if(this.props.ppPrices && this.props.mgmPrices && this.state.cart && !this.state.checkout && !this.state.shipment && !this.state.payment){
            return (
                <section className="Content" id="Cart" onClick={this.props.releaseScroll}>
                    <div className="TranspBackground"></div>
                    <ShoppingCart checkOrder={this.checkOrder} removeItem={this.props.removeItem} productUpdate={this.props.productUpdate} items={this.props.items} lockScroll={this.props.lockScroll} notMobile={this.props.notMobile} checkout={this.checkout} ppPrices={this.props.ppPrices} mgmPrices={this.props.mgmPrices} />
                </section>
            );
        } else if(!this.state.cart && this.state.checkout && !this.state.shipment && !this.state.payment){
            return (
                <section className="Content" id="Cart" onClick={this.props.releaseScroll}>
                    <div className="TranspBackground"></div>
                    <ShoppingBar closeImage={(e) => this.backToCart()} />
                    <Checkout items={this.props.items} lockScroll={this.props.lockScroll} notMobile={this.props.notMobile} shipment={this.shipment} ppPrices={this.props.ppPrices} mgmPrices={this.props.mgmPrices} />
                </section>
            );
        } else if(!this.state.cart && !this.state.checkout && this.state.shipment && !this.state.payment){
            return (
                <section className="Content" id="Cart" onClick={this.props.releaseScroll}>
                    <div className="TranspBackground"></div>
                    <ShoppingBar closeImage={(e) => this.backToCart()} />
                    <Shipment shipmentInfo={this.props.shipmentInfo} lockScroll={this.props.lockScroll} payment={this.payment} userId={this.props.userId} />
                </section>
            );
        } else if(!this.state.cart && !this.state.checkout && !this.state.shipment && this.state.payment && this.props.pwintyId !== ''){
            return (
                <section className="Content" id="Cart" onClick={this.props.releaseScroll}>
                    <div className="TranspBackground"></div>
                    <ShoppingBar closeImage={(e) => this.backToCart()} />
                    <Payment pwintyId={this.props.pwintyId} backToCart={this.backToCart} userId={this.props.userId} lockScroll={this.props.lockScroll} notMobile={this.props.notMobile} orderReview={this.props.orderReview} subtotal={this.props.subtotal} />
                </section>
            );
        } else {
            return (<div className="TranspBackground"><h4>Waiting on the clouds, bro.</h4></div>)
        }
    }
}

export default OrderProcessing;