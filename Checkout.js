
import React from 'react';

import {Type} from './ShoppingCart'

//create a stateless component to display the shopping cart items
export const Checkout = (props) => {
    return (
    <div className="shoppingCart">
        <h3>Please Confirm Your Order.</h3>
        <h4>Close checkout to return to Cart</h4>
        <ProductDisplay items={props.items} shipment={props.shipment} ppPrices={props.ppPrices} mgmPrices={props.mgmPrices} />
    </div>
    )
}

const ProductDisplay = (props) => {
    return (
    <div className="cartList">
        {props.items.map((currItem, index)=> 
            <Display key={index} index={index} item={currItem} ppPrices={props.ppPrices} mgmPrices={props.mgmPrices} />
        )}
        <div className="shipmentButton" onClick={(e) => props.shipment()}>Shipment</div>
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
        if (this.props.item.type === Type[0]){
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
                    <img src={this.props.item.Img.src} alt={this.props.item.Img.name} id={this.props.index} />
                </figure>
                <form>
                    <table className="ContentInformation"><tbody>
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
                        </tbody></table>
                </form>
            </div>
        )
    }
}
