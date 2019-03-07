import React from 'react';

import firebase from "../../Firebase";

import { ShoppingCart } from './ShoppingCart'
import { Checkout } from './Checkout';
import { Shipment } from './Shipment';
import { Payment } from './Payment';
import { ShoppingBar } from '../../ShoppingBar/ShoppingBar';
import { isNullOrUndefined } from 'util';

class OrderProcessing extends React.Component {
    constructor(props){
      super(props);
      this.state= {
        checkout: false,
        shipment: false,
        payment: false,
        dbId: '',
        shipmentInfo: {},
      }

      this.checkout = this.checkout.bind(this);
      this.shipment = this.shipment.bind(this);
      this.payment = this.payment.bind(this);
      this.backToCart = this.backToCart.bind(this);
      this.createOrder = this.createOrder.bind(this);
      this.addShipmentToDb = this.addShipmentToDb.bind(this);
      this.checkOrder = this.checkOrder.bind(this);
    }

    //changes the state show the checkout page is rendered
    //called from shopping cart page
    checkout = () => {
        this.createOrder();
        this.setState({
            checkout: true,
            shipment: false,
            payment: false,
        })
    }

    //changes the state show the shipment page is rendered
    //called from shopping cart page
    shipment = () => {
        this.setState({
            checkout: false,
            shipment: true,
            payment: false
        })
    }

    //changes the state show the shipment page is rendered
    //called from shopping cart page
    //todo: create payment page and display it when user is ready to payment
    payment = () => {
        this.setState({
            checkout: false,
            shipment: false,
            payment: true
        })
    }

    //sends user back to cart
    //called from shopping cart page
    //todo: allow user to update values if they return to cart
    backToCart = () => {
        this.setState({
          checkout: false,
          shipment: false,
          payment: false,
        })
    }

    createOrder = async () => {
        //1. create a reference to where the images will be stored in database
        const reference = firebase.firestore().collection('Orders/');
        const dbRef = async () => {
          try {
            let dbResponse;
            if (this.state.dbId===''){
                //2a. push items to database
                dbResponse = await reference.add({data: this.props.items, pwintyId: '', shipmentInfo: {}, validate: false});}
            else {dbResponse = await reference.doc(this.state.dbId).update({data: this.props.items});}
            return dbResponse;
          } catch (error) {
            console.log(error);
            //2b. if there is an error, return error
            return null;
          }
        };
        //call the above function
        const db = await dbRef();
        if (this.state.dbId===''){
            this.setState({dbId: db.id})}
    }

    //allow user to call a previously made order
    checkOrder = async (userInputId) =>{
        //make reference to order with user input
        var docRef = firebase.firestore().collection("Orders/").doc(userInputId);
        
        //get the data from firebase, if it exists
        const getDbData = async () => {
            try {
                const dbResponse = await docRef.get();
                return dbResponse
            } catch (error) {
                console.log(error);
                return null
            }
        }

        //firebase will still return an item, even if it doesn't exist
        const returnData = await getDbData();
        //if item exists, send data to App.js to update cart
        if (returnData.exists){
            //update dbId to what is existing
            this.setState({dbId:userInputId})
            //set variable to take the cart data to the callback function
            const reloadCart = returnData.data().data;
            //callback function to throw data in cart
            this.props.openCart(reloadCart);
            //set shipment data if it exists
            if (!isNullOrUndefined(returnData.data().shipmentInfo)){
                this.setState({shipmentInfo: returnData.data().shipmentInfo})
            }
        } else {alert('Check order ID and try again')}
    }

    addShipmentToDb = async (shipmentInfo) => {
        //1. create a reference to where the shipment info will be stored in database
        const ordersRef = firebase.firestore().collection('Orders/').doc(this.state.dbId);
        //2. function to push shipment info to order data
        const dbAddShipmentInfo = async () => {
          try {
            //2a. push items to database
            const dbResponse = await ordersRef.update({shipmentInfo});
            return dbResponse;
          } catch (error) {
            console.log(error);
            //2b. if there is an error, return error
            return error;
          }
        };
        //call the above function
        dbAddShipmentInfo();
        this.payment();
    };

    render() {
        if(!this.state.checkout && !this.state.shipment && !this.state.payment){
            return (
                <section className="Content" id="Cart" onClick={this.props.releaseScroll}>
                    <div className="TranspBackground"></div>
                    <ShoppingCart checkOrder={this.checkOrder} removeItem={this.props.removeItem} productUpdate={this.props.productUpdate} items={this.props.items} lockScroll={this.props.lockScroll} notMobile={this.props.notMobile} checkout={this.checkout} ppPrices={this.props.ppPrices} mgmPrices={this.props.mgmPrices} />
                </section>
            );
        } else if(this.state.checkout && !this.state.shipment && !this.state.payment){
            return (
                <section className="Content" id="Cart" onClick={this.props.releaseScroll}>
                    <div className="TranspBackground"></div>
                    <ShoppingBar closeImage={(e) => this.backToCart()} dbId={this.state.dbId}/>
                    <Checkout items={this.props.items} lockScroll={this.props.lockScroll} notMobile={this.props.notMobile} shipment={this.shipment} ppPrices={this.props.ppPrices} mgmPrices={this.props.mgmPrices} />
                </section>
            );
        } else if(!this.state.checkout && this.state.shipment && !this.state.payment){
            return (
                <section className="Content" id="Cart" onClick={this.props.releaseScroll}>
                    <div className="TranspBackground"></div>
                    <ShoppingBar closeImage={(e) => this.backToCart()} dbId={this.state.dbId}/>
                    <Shipment lockScroll={this.props.lockScroll} notMobile={this.props.notMobile} addShipmentToDb={this.addShipmentToDb} shipmentInfo={this.state.shipmentInfo}/>
                </section>
            );
        } else if(!this.state.checkout && !this.state.shipment && this.state.payment){
            return (
                <section className="Content" id="Cart" onClick={this.props.releaseScroll}>
                    <div className="TranspBackground"></div>
                    <ShoppingBar closeImage={(e) => this.backToCart()} dbId={this.state.dbId}/>
                    <Payment lockScroll={this.props.lockScroll} notMobile={this.props.notMobile}/>
                </section>
            );
        }
    }
}

export default OrderProcessing;