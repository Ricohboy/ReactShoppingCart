import React from "react";

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
    <div className="shoppingCart">
      <h3>
        Enter Your Shipping Details Below. We can only ship inside the US.
      </h3>
      <ShipmentForm addShipmentToDb={props.addShipmentToDb} shipmentInfo={props.shipmentInfo}/>
    </div>
  );
};

class SubmitButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        hasSubmitted: false,
        message: "Click to validate and submit"
    }
    this.handleSubmission = this.handleSubmission.bind(this);
  }

  handleSubmission = () => {
    this.setState({hasSubmitted: true});
    this.props.handleSubmit()
  }

  validate(){
    if (this.props.canSubmit) {this.handleSubmission()}
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
        <div className="submitButton" onClick={(e)=>this.validate()}>
          {this.state.message}
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

  //create all the options from the type array
  stateList = states.map((state, index) => (
    <option key={index}>{state}</option>
  ));

  handleSubmit = () => {
    this.props.addShipmentToDb(this.state)
  }

  componentDidMount(){
    if (this.props.shipmentInfo !== {}){this.setState(this.props.shipmentInfo)}
  }

  validate = () => {
    let submit = true;
    Object.keys(this.state).map(i => {
      if (i !== "address2") {
        if (this.state[i] === "") {
          submit = false;
          //todo:add function that changes invalid data's text box red
          /*console.log(i)
          const ele = document.getElementsByName(i);
          console.log(ele);*/
        }
      }
    });
    return submit;
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
        <br />
        <label>
          Address 1:
          <input
            type="text"
            name="address1"
            value={this.state.address1}
            onChange={event => this.handleUserInput(event)}
          />
        </label>
        <br />
        <label>
          Address 2:
          <input
            type="text"
            name="address2"
            value={this.state.address2}
            onChange={event => this.handleUserInput(event)}
          />
        </label>
        <br />
        <label>
          City:
          <input
            type="text"
            name="addressTownOrCity"
            value={this.state.addressTownOrCity}
            onChange={event => this.handleUserInput(event)}
          />
        </label>
        <br />
        <label>
          State:
          <select
            name="stateOrCounty"
            value={this.state.stateOrCounty}
            onChange={event => this.handleUserInput(event)}
          >
            {this.stateList}
          </select>
        </label>
        <br />
        <label>
          ZipCode:
          <input
            type="text"
            name="postalOrZipCode"
            value={this.state.postalOrZipCode}
            onChange={event => this.handleUserInput(event)}
          />
        </label>
        <br />
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
