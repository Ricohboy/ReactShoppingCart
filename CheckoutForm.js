import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';

import firebase from "../../Firebase";

import {Button} from 'react-bootstrap'

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state={
      hasSubmitted:false,
    }
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    this.setState({hasSubmitted:true})
    let {token} = await this.props.stripe.createToken({name: "Name"});
    const stripeRequest = firebase.functions().httpsCallable('finalizeStripeOrder')
    try {
        const outcome = await stripeRequest({token: token.id, subtotal: this.props.subtotal, userId: this.props.userId});
        if (outcome.data === 'authorized'){
          this.props.handleSubmit();
        }
        //todo: add else statement for when payment is not authorized
    } catch (error) {
        console.log(error)
        alert('Payment Not Processed')
    }
  }

  render() {
    return (
      <div className="checkout">
        <p>Would you like to complete the purchase?</p>
        <CardElement />
        {!this.state.hasSubmitted && <Button className="submitButton" onClick={(e)=>this.submit()}>Payment Powered By Stripe</Button>}
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);