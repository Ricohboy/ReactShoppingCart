import React from 'react';

import firebase from "../../Firebase";

class SubmitButton extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          hasSubmitted: false,
          message: "Promise you'll pay?"
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
          <div className="submitButton">
            Waiting on the Clouds . . .
          </div>
        )
      } else {
        return (
          <div className="submitButton" onClick={(e)=>this.handleSubmit()}>
            {this.state.message}
          </div>
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

  componentDidMount = async () => {
  }

  render () {
    return (
      <div>
        <h4>Pwinty Order ID: {this.props.pwintyId}</h4>
        <SubmitButton handleSubmit={this.handleSubmit} />
      </div>
    )
  }
}

export default Payment;