import React from "react";

import firebase from "../../Firebase";

const states = [
  "AL",  "AK",  "AS",  "AZ",  "AR",  "CA",  "CO",  "CT",
  "DE",  "DC",  "FM",  "FL",  "GA",  "GU",  "HI",  "ID",
  "IL",  "IN",  "IA",  "KS",  "KY",  "LA",  "ME",  "MH",
  "MD",  "MA",  "MI",  "MN",  "MS",  "MO",  "MT",  "NE",
  "NV",  "NH",  "NJ",  "NM",  "NY",  "NC",  "ND",  "MP",
  "OH",  "OK",  "OR",  "PW",  "PA",  "PR",  "RI",  "SC",
  "SD",  "TN",  "TX",  "UT",  "VT",  "VI",  "VA",  "WA",
  "WV",  "WI",  "WY"];

//create a stateless component to display the shopping cart items
export const Shipment = props => {
  return (
    <div className="shoppingCart" onClick={(e) => props.lockScroll(e)}>
      <h3>
        Enter Your Shipping Details Below. We can only ship inside the US.
      </h3>
      <ShipmentForm payment={props.payment} userId={props.userId} shipmentInfo={props.shipmentInfo} />
    </div>
  );
};

class SubmitButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        hasSubmitted: false,
        message: "Submit"
    }
    this.handleSubmission = this.handleSubmission.bind(this);
  }

  handleSubmission = (defAddr) => {
    this.setState({hasSubmitted: true});
    this.props.handleSubmit(defAddr)
  }

  validate(defAddr){
    if (this.props.canSubmit) {this.handleSubmission(defAddr)}
    else {this.setState({message: "Form not valid! Click again when ready."})}
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
        <div>
          <div className="submitButton" onClick={(e)=>this.validate(false)}>
            Use Once<br/>
            {this.state.message}
          </div>
          <br/>
          <div className="submitButton" onClick={(e)=>this.validate(true)}>
            Set As Default<br/>
            {this.state.message}
          </div>
        </div>
      )
    }
  }
}

class ShipmentForm extends React.Component {
  //create the state that will be submitted to Pwinty
  constructor(props) {
    super(props);
    this.state = {
      countryCode: "US",
      recipientName: "",
      address1: "",
      address2: "",
      addressTownOrCity: "",
      stateOrCounty: "",
      postalOrZipCode: "",
      preferredShippingMethod: "Budget",
      email: ""
    };

    this.handleUserInput = this.handleUserInput.bind(this);
    this.validate = this.validate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUserInput(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  //create all the State options from the State array
  stateList = states.map((state, index) => (
    <option key={index}>{state}</option>
  ));

  handleSubmit = async (defAddr) => {
    //1. create a reference to where the shipment info will be stored in database
    const userRef = firebase.firestore().collection('User/').doc(this.props.userId);
    //2. function to push shipment info to order data
    try {
      //2a. push items to database
      let dbResponse
      if(defAddr) {dbResponse = await userRef.update({shipmentInfo: this.state, defaultAddress:this.state});
      } else {dbResponse = await userRef.update({shipmentInfo: this.state});}
      this.props.payment();
      return dbResponse;
    } catch (error) {
      console.error(error);
      alert('There seems to have been an issue creating your order.  Please try again.')
      //2b. if there is an error, return error
      return error;
    }
  };
  

  validate = () => {
    let submit = true;
    Object.keys(this.state).map(i => {
      if (i !== "address2") {
        if (this.state[i] === "") {
          submit = false;
        }
      }
      return null;
    });
    return submit;
  }

  componentDidMount(){
    if (this.props.shipmentInfo !== {}) {
        this.setState(this.props.shipmentInfo)
      }
  }

  render() {
    return (
      <form>
        <label id="recipientName">
          Recipient Name:
          <input
            type="text"
            name="recipientName"
            value={this.state.recipientName}
            onChange={event => this.handleUserInput(event)}
          />
        </label>
        
        <label>
          Address 1:
          <input
            type="text"
            name="address1"
            value={this.state.address1}
            onChange={event => this.handleUserInput(event)}
          />
        </label>
        
        <label>
          Address 2:
          <input
            type="text"
            name="address2"
            value={this.state.address2}
            onChange={event => this.handleUserInput(event)}
          />
        </label>
        
        <label>
          City, State:
          <input
            type="text"
            name="addressTownOrCity"
            className="city"
            value={this.state.addressTownOrCity}
            onChange={event => this.handleUserInput(event)}
          />
          <select
            name="stateOrCounty"
            value={this.state.stateOrCounty}
            onChange={event => this.handleUserInput(event)}
          >
            {this.stateList}
          </select>
        </label>
        
        <label>
          ZipCode:
          <input
            type="text"
            name="postalOrZipCode"
            value={this.state.postalOrZipCode}
            onChange={event => this.handleUserInput(event)}
          />
        </label>
        
        <label>
          eMail:
          <input
            type="text"
            name="email"
            value={this.state.email}
            onChange={event => this.handleUserInput(event)}
          />
        </label>
        <SubmitButton handleSubmit={this.handleSubmit} canSubmit={this.validate()} />
      </form>
    );
  }
}
