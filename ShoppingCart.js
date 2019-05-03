
import React from 'react';
import './ShoppingCart.css';

import { Button } from 'react-bootstrap';

//create an array of options to choos from
export const Type=["Mid-Gloss Metal", "Photo Paper"]
export const Size=["8x12", "16x24", "20x30", "24x36"]

//create a stateless component to display the shopping cart items
export const ShoppingCart = (props) => {
    //if the shopping cart has no items, let user know the cart is empty.
    if (props.items.length === 0) {
        return (
            <div className="EmptyCart">
                <Header notMobile={props.notMobile}/>
                Nothing in Cart, please add something.
            </div>)
    } else{
        return (
        <div className="shoppingCart" id="shoppingCartScroll" onClick={(e) => props.lockScroll(e)}>
            <Header notMobile={props.notMobile}/>
            <ProductDisplay removeItem={props.removeItem} productUpdate={props.productUpdate} items={props.items} checkout={props.checkout} ppPrices={props.ppPrices} mgmPrices={props.mgmPrices} />
        </div>)
    };
}

//user will select which type of print they want.
class TypeSelector extends React.Component {
    //create the state, choose the first option in array to allow for rapid changes
    constructor(props){
        super(props)
        this.state = {
            type: this.props.type,
        }

        this.handleChange = this.handleChange.bind(this);
    }

    //create an event handler function when the user changes options.
    handleChange = async (e) => {
        await this.setState({type: e.target.value});
        this.props.typeCallBack(this.state.type);
    }

    //create all the options from the type array
    types = Type.map((type, index) =>
        <option value={type} key={index}>{type}</option>
    )

    //simple render
    render(){
        return(
            <label>
                <select value={this.state.type} onChange={(e) => this.handleChange(e)}>
                    {this.types}
                </select>
            </label>
        )
    }
}

//similar function to TypeSelector, see notes on TypeSelector
class SizeSelector extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            size: this.props.size,
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = async (e) => {
        await this.setState({size: e.target.value});
        this.props.sizeCallBack(this.state.size);
    }

    render(){
        if(this.props.type === Type[0]){
            return(
                <label>
                    <select value={this.state.size} onChange={(e) => this.handleChange(e)}>
                        {this.props.mgmPrices!==null && Size.map((size, index) => <option value={size} key={index}>{size} ${this.props.mgmPrices[size]}.00</option>)}
                    </select>
                </label>
            )
        } else {
            return(
                <label>
                    <select value={this.state.size} onChange={(e) => this.handleChange(e)}>
                        {this.props.ppPrices!==null && Size.map((size, index) => <option value={size} key={index}>{size} ${this.props.ppPrices[size]}.00</option>)}
                    </select>
                </label>
            )
        } 
    }
}

//similar function to TypeSelector, see notes on TypeSelector
class Quantity extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            quantity: this.props.quantity,
        }
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
    }

    handleQuantityChange = async (e) => {
        const userInput = e.target.value;
        await this.setState({quantity: userInput})
        this.props.quantityCallBack(this.state.quantity)
    }

    render(){
        return(
            <td>
                <input
                    name="number"
                    type="number"
                    value={this.state.quantity}
                    onChange={this.handleQuantityChange}
                    max="10"
                    min="1"/>
            </td>
        )
    }
}

//A function to display all the cart items the user selected and allow them to change type, size, and quantity
class ProductDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.productUpdate = this.productUpdate.bind(this);
    }

    //update products upon any change.
    productUpdate = (size, type, quantity, index) => {
        this.props.productUpdate(size, type, quantity, index);
    }

    //simple render function
    render() {
        return (
            <div className="cartList">
                {this.props.items.map((currItem, index)=> 
                    <Display item={currItem} removeItem={this.props.removeItem} index={index} key={index} productUpdate={this.productUpdate} ppPrices={this.props.ppPrices} mgmPrices={this.props.mgmPrices} />
                )}
                <Button className="checkoutButton" onClick={(e) => this.props.checkout()}>Checkout</Button>
            </div>
        )
    }
}

//component that handles the display of each individual product
class Display extends React.Component{
    //will update size, type and quantity in this component, then send values to parent product display
    constructor(props) {
        super(props);
        this.state = {
            size: this.props.item.order.size,
            type: this.props.item.order.type,
            quantity: this.props.item.order.quantity,
        }

        this.sizeCallBack = this.sizeCallBack.bind(this);
        this.quantityCallBack = this.quantityCallBack.bind(this);
        this.typeCallBack = this.typeCallBack.bind(this);
    }

    //get sizes from child, then send to parent(ProductDisplay)
    sizeCallBack = async (changedSize) => {
        let tempPrice;
        if (this.state.type === Type[0]){
            tempPrice = this.props.mgmPrices[changedSize]
        } else {
            tempPrice = this.props.ppPrices[changedSize]
        }
        this.setState({
            size: changedSize,
            price: tempPrice,
            total: tempPrice*this.state.quantity
        })
        this.props.productUpdate(this.state.size, this.state.type, this.state.quantity, this.props.index)
    }

    //get quantity from child, then send to parent(ProductDisplay)
    quantityCallBack = (changedQuantity) => {
        this.setState({
            quantity: changedQuantity,
            total: this.state.price*changedQuantity
        })
        this.props.productUpdate(this.state.size, this.state.type, this.state.quantity, this.props.index)
    }

    //get product type from child, then send to parent(ProductDisplay)
    typeCallBack = (changedType) => {
        let tempPrice;
        if (changedType === Type[0]){
            tempPrice = this.props.mgmPrices[this.state.size]
        } else {
            tempPrice = this.props.ppPrices[this.state.size]
        }
        this.setState({
            type: changedType,
            price: tempPrice,
            total: tempPrice*this.state.quantity
        })
        this.props.productUpdate(this.state.size, this.state.type, this.state.quantity, this.props.index)
    }

    removeItem = (index) => {
        this.props.removeItem(index);
    }

    componentDidMount = async () => {
        let tempPrice;
        if (this.props.item.order.type === Type[0]){
            tempPrice = this.props.mgmPrices[this.props.item.order.size]
        } else {
            tempPrice = this.props.ppPrices[this.props.item.order.size]
        }
        this.setState({price: tempPrice, total: tempPrice*this.props.item.order.quantity})
    }

    //render individual item
    render() {
        return (
            <div key={this.props.index} className="CartItem">
                <figure>
                    <img src={this.props.item.Img.thumb} alt={this.props.item.Img.name} id={this.props.index} />
                    <figcaption onClick={(e) => this.removeItem(this.props.index)}>Remove</figcaption>
                </figure>
                <form>
                    <table className="ContentInformation"><tbody>
                        <tr>
                            <td><b>Image Description: </b></td>
                            <td>{this.props.item.Img.description}</td>
                        </tr>
                        <tr>
                            <td><b>Size:</b></td>
                            <td><SizeSelector sizeCallBack={this.sizeCallBack} ppPrices={this.props.ppPrices} mgmPrices={this.props.mgmPrices} type={this.state.type} size={this.state.size} /></td>
                        </tr>
                        <tr>
                            <td><b>Type:</b></td>
                            <td><TypeSelector typeCallBack={this.typeCallBack} type={this.state.type} /></td>
                        </tr>
                        <tr>
                            <td><b>Quantity:</b></td>
                            <Quantity quantityCallBack={this.quantityCallBack} quantity={this.state.quantity} />
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

//simple header that changes if the site is mobile or not.
const Header = (props) =>{
    if(props.notMobile){
        return(<h3>Shopping Cart<br/>Click Inside Cart to Lock Main Page Scrolling<br/>Click Edges to Unlock</h3>)
    } else {
        return(<h3>Shopping Cart</h3>)
    }
}
