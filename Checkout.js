
import React from 'react';

import {Type} from './ShoppingCart'

import { Button } from 'react-bootstrap';


class Checkout extends React.Component {

    //write a function to call to calculate the subtotal based on chosen products
    subtotal = () => {
        let tempSubtotal = 0
        this.props.items.map((currItem) => {
            const size = currItem.order.size
            if (currItem.order.type === Type[0]){
                tempSubtotal += this.props.mgmPrices[size]
            } else {
                tempSubtotal += this.props.ppPrices[size]
            }
            return null;
        })
        return tempSubtotal
    }

    render(){
        //call function inside render, this can be used in the return item
        const subtotal = this.subtotal();
        return (
        <div className="shoppingCart">
            <h3>Please Confirm Your Order.</h3>
            <h4>Close checkout to return to Cart</h4>
            <h4>Current Subtotal: ${subtotal}.00</h4>
            <ProductDisplay subtotal={subtotal} items={this.props.items} shipment={this.props.shipment} ppPrices={this.props.ppPrices} mgmPrices={this.props.mgmPrices} />
        </div>
        )
    }
}

const ProductDisplay = (props) => {
    return (
    <div className="cartList">
        {props.items.map((currItem, index)=> 
            <Display key={index} index={index} item={currItem} ppPrices={props.ppPrices} mgmPrices={props.mgmPrices} />
        )}
        <Button className="shipmentButton" onClick={(e) => props.shipment(e, props.subtotal)}>Save and Continue</Button>
    </div>
    )
}


//component that handles the display of each individual product
class Display extends React.Component{
    //will update size, type and quantity in this component, then send values to parent product display
    constructor(props) {
        super(props);
        this.state = {
            price: 0,
            total: 0
        }
    }

    componentDidMount = async () => {
        let tempPrice;
        const size = this.props.item.order.size
        if (this.props.item.order.type === Type[0]){
            tempPrice = this.props.mgmPrices[size]
        } else {
            tempPrice = this.props.ppPrices[size]
        }
        this.setState({price: tempPrice, total: tempPrice*this.props.item.order.quantity})
    }

    //render individual item
    render() {
        return (
            <div key={this.props.index} className="CartItem">
                <figure>
                    <img src={this.props.item.Img.thumb} alt={this.props.item.Img.name} id={this.props.index} />
                </figure>
                    <table className="ContentInformation">
                    <tbody>
                        <tr>
                            <td><b>Image Description: </b></td>
                            <td>{this.props.item.Img.description}</td>
                        </tr>
                        <tr>
                            <td><b>Size:</b></td>
                            <td>{this.props.item.order.size}</td>
                        </tr>
                        <tr>
                            <td><b>Type:</b></td>
                            <td>{this.props.item.order.type}</td>
                        </tr>
                        <tr>
                            <td><b>Quantity:</b></td>
                            <td>{this.props.item.order.quantity}</td>
                        </tr>
                        <tr>
                            <td><b>Price Per:</b></td>
                            <td>${this.state.price}.00</td>
                        </tr>
                        <tr>
                            <td><b>Total:</b></td>
                            <td>${this.state.total}.00</td>
                        </tr>
                    </tbody>
                    </table>
            </div>
        )
    }
}

export default Checkout;