import React from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';

import {Button} from 'react-bootstrap'

import firebase from "../../Firebase";

class CODButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        hasSubmitted: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = () => {
    this.setState({hasSubmitted: true});
    this.props.handleSubmit()
  }
  
  render() {
    if (this.state.hasSubmitted) {
      return (
        <Button className="submitButton">
          Waiting on the Clouds . . .
        </Button>
      )
    } else {
      return (
        <Button className="submitButton" onClick={(e)=>this.handleSubmit()}>
          Promise you'll pay?<br />Or Try:
        </Button>
      )
    }
  }
}

//create a stateless component to display the shopping cart items
class Payment extends React.Component {
  constructor(props){
      super(props);

      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = async () => {
    
    //1. create a reference to where the order is validated
    const validateRef = firebase.firestore().collection('User/').doc(this.props.userId).collection('CurrentOrder/').doc('Validate')
    try {
      const dbResponse = await validateRef.set({validate:true})
      this.props.backToCart();
      this.props.orderReview();
      return dbResponse;
    } catch (error) {
      console.error(error);
      alert('There seems to have been an issue processing your order.')
      //2b. if there is an error, return error
      return error;
    }
  }

  render() {
    return (
      <div>
        <h4>Pwinty Order ID: {this.props.pwintyId}</h4>
        <CODButton handleSubmit={this.handleSubmit} />
        <StripeProvider apiKey="pk_test_Un1W2im9NOiQdgFDea37LaPv">
          <div className="example">
            <h4>React Stripe Elements Example</h4>
            <Elements>
              <CheckoutForm subtotal={this.props.subtotal} handleSubmit={this.handleSubmit} userId={this.props.userId} />
            </Elements>
          </div>
        </StripeProvider>
      </div>
    );
  }
}

export default Payment;