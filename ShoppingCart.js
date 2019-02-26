
import React from 'react';
import './ShoppingCart.css';

//create a stateless component to display the shopping cart items
export const ShoppingCart = (props) => {
    //if the shopping cart has no items, let user know the cart is empty.
    if (props.items.length === 0) {
        return (
            <div className="EmptyCart">
                <Header notMobile={props.notMobile}/>
                Nothing in Cart
            </div>)
    } else
        return (
        <div className="shoppingCart" id="shoppingCartScroll" onClick={(e) => props.lockScroll()}>
            <Header notMobile={props.notMobile}/>
            <ProductDisplay items={props.items} checkout={props.checkout}/>
        </div>)
    ;
}

//create an array of options to choos from
const Type=["Metalic Gloss", "Photo Paper"]
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
    //needs to be an async/await function to allow for the state to change before using callback function
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
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = async (e) => {
        await this.setState({size: e.target.value});
        this.props.sizeCallBack(this.state.size);
    }

    sizes = Size.map((size, index) =>
        <option value={size} key={index}>{size}</option>
    )

    render(){
        return(
            <label>
                <select value={this.state.value} onChange={(e) => this.handleChange(e)}>
                    {this.sizes}
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

    //go through each item sent to the cart to display
    cartList = this.props.items.map((currImg, index)=> 
        <Display image={currImg} index={index} key={index} productCallBack={this.productCallBack}/>
    )

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
        return (
            <div className="cartList">
                {this.cartList}
                <div className="checkout" onClick={(e) => this.handleCheckout(e)}>Checkout</div>
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
            quantity: 1
        }

        this.sizeCallBack = this.sizeCallBack.bind(this);
        this.quantityCallBack = this.quantityCallBack.bind(this);
        this.typeCallBack = this.typeCallBack.bind(this);
    }

    //get sizes from child, then send to parent(ProductDisplay)
    sizeCallBack = async (changedSize) => {
        await this.setState({
            size: changedSize
        })
        this.props.productCallBack(this.state, this.props.index)
    }

    //get quantity from child, then send to parent(ProductDisplay)
    quantityCallBack = (changedQuantity) => {
        this.setState({
            quantity: changedQuantity
        })
        this.props.productCallBack(this.state, this.props.index)
    }

    //get product type from child, then send to parent(ProductDisplay)
    typeCallBack = (changedType) => {
        this.setState({
            type: changedType
        })
        this.props.productCallBack(this.state, this.props.index)
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
                            <td><SizeSelector sizeCallBack={this.sizeCallBack} /></td>
                        </tr>
                        <tr>
                            <td><b>Type:</b></td>
                            <td><TypeSelector typeCallBack={this.typeCallBack} /></td>
                        </tr>
                        <tr>
                            <td><b>Quantity:</b></td>
                            <Quantity quantityCallBack={this.quantityCallBack} />
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


export default ShoppingCart;