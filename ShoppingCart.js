
import React from 'react';
import './ShoppingCart.css';

//create a stateless component to display the shopping cart items
export const ShoppingCart = (props) => {
    console.log(props)
    //if the shopping cart has no items, let user know the cart is empty.
    if (props.items.length === 0) {
        return (
            <div className="EmptyCart">
                <Header notMobile={props.notMobile}/>
                Nothing in Cart
            </div>)
    } else{
        console.log(props)
        return (
        <div className="shoppingCart" id="shoppingCartScroll" onClick={(e) => props.lockScroll()}>
            <Header notMobile={props.notMobile}/>
            <ProductDisplay items={props.items} checkout={props.checkout} ppPrices={props.ppPrices} mgmPrices={props.mgmPrices} />
        </div>)
    };
}

//create an array of options to choos from
const Type=["Mid-Gloss Metal With Hanger", "Photo Paper"]
const Size=["8x12", "12x18", "16x24", "20x30", "24x36"]


//user will select which type of print they want.
class TypeSelector extends React.Component {
    //create the state, choose the first option in array to allow for rapid changes
    constructor(props){
        super(props)
        this.state = {
            type: Type[0],
        }
        this.handleChange = this.handleChange.bind(this);
    }

    //create an event handler function when the user changes options.
    //needs to be an async/await function to allow for the state to change 
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
                <select value={this.state.value} onChange={(e) => this.handleChange(e)}>
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
            size: Size[0],
            price: null
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = async (e) => {
        await this.setState({size: e.target.value});
        this.props.sizeCallBack(this.state.size);
    }

    componentDidMount = async () => {
        let tempPriceList;
        if (this.props.type === 'MGM') {
            tempPriceList = this.props.mgmPrices;
        } else {
            tempPriceList = this.props.ppPrices
        }
        await this.setState({
            price: tempPriceList,
        })
        
    }

    render(){
        return(
            <label>
                <select value={this.state.value} onChange={(e) => this.handleChange(e)}>
                    {this.state.price!==null && Size.map((size, index) => <option value={size} key={index}>{size} ${this.state.price[size]}.00</option>)}
                </select>
            </label>
        )
    }
}

//similar function to TypeSelector, see notes on TypeSelector
class Quantity extends React.Component {
    constructor(){
        super()
        this.state = {
            quantity: 1,
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
                    min="0"/>
            </td>
        )
    }
}

//A function to display all the cart items the user selected and allow them to change type, size, and quantity
class ProductDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
        }
    }

    //update products upon any change.
    productCallBack = async (order, index) => {
        //create a new array that takes in the products array
        let updatedProducts = this.state.products;
        //call the currImg item from the existing products array
        const currImg = updatedProducts[index].currImg;
        //update the item in the mutable array to add changes to the order
        updatedProducts[index] = {currImg, order};
        //reset products array using .setState function
        await this.setState({products:updatedProducts});
    }

    //send product list to checkout.
    //todo: create checkout function
    handleCheckout = () => {
        console.log("Checkout Time Babay")
        this.props.checkout(this.state.products)
    }

    //create initial product array once component mounts
    componentDidMount = async () => {
        let productList = [];
        await this.props.items.map((currImg) => 
            productList.push({currImg, order: {size: Size[0], type: Type[0], quantity: 1}})
        )
        this.setState({products:productList})
    }

    //simple render function
    render() {
        console.log(this.props)
        return (
            <div className="cartList">
                {this.props.items.map((currImg, index)=><Display image={currImg} index={index} key={index} productCallBack={this.productCallBack} ppPrices={this.props.ppPrices} mgmPrices={this.props.mgmPrices} />
                )}
                <div className="checkoutButton" onClick={(e) => this.handleCheckout(e)}>Checkout</div>
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
            size: Size[0],
            type: Type[0],
            quantity: 1,
            price: 0,
            total: 0
        }

        this.sizeCallBack = this.sizeCallBack.bind(this);
        this.quantityCallBack = this.quantityCallBack.bind(this);
        this.typeCallBack = this.typeCallBack.bind(this);
    }

    //get sizes from child, then send to parent(ProductDisplay)
    sizeCallBack = async (changedSize) => {
        let tempPrice;
        if (this.type === Type[0]){
            tempPrice = this.props.mgmPrices[changedSize]
        } else {
            tempPrice = this.props.ppPrices[changedSize]
        }
        await this.setState({
            size: changedSize,
            price: tempPrice,
            total: tempPrice*this.state.quantity
        })
        this.props.productCallBack(this.state, this.props.index)
    }

    //get quantity from child, then send to parent(ProductDisplay)
    quantityCallBack = (changedQuantity) => {
        this.setState({
            quantity: changedQuantity,
            total: this.state.price*changedQuantity
        })
        this.props.productCallBack(this.state, this.props.index)
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
        console.log(this.state)
        this.props.productCallBack(this.state, this.props.index)
    }

    componentDidMount = async () => {
        const tempPrice = await this.props.mgmPrices[this.state.size];
        this.setState({price: tempPrice, total: tempPrice*this.state.quantity})
    }

    //render individual item
    render() {
        return (
            <div key={this.props.index} className="CartItem">
                <figure><img src={this.props.image.src} alt={this.props.image.name} id={this.props.index} /></figure>
                <form>
                    <table className="ContentInformation"><tbody>
                        <tr>
                            <td><b>Image Description: </b></td>
                            <td>{this.props.image.description}</td>
                        </tr>
                        <tr>
                            <td><b>Size:</b></td>
                            <td><SizeSelector sizeCallBack={this.sizeCallBack} ppPrices={this.props.ppPrices} mgmPrices={this.props.mgmPrices} type={this.state.type} /></td>
                        </tr>
                        <tr>
                            <td><b>Type:</b></td>
                            <td><TypeSelector typeCallBack={this.typeCallBack} /></td>
                        </tr>
                        <tr>
                            <td><b>Quantity:</b></td>
                            <Quantity quantityCallBack={this.quantityCallBack} />
                        </tr>
                        <tr>
                            <td><b>Price Per:</b></td>
                            <td>{this.state.price}</td>
                        </tr>
                        <tr>
                            <td><b>Total:</b></td>
                            <td>{this.state.total}</td>
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
