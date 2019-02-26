# ReactShoppingCart
A simple shopping cart for React!

A customizable file that my app calls to create a list of products a user wants to purchase.  The App has the following call and props:

<ShoppingCart items={this.state.cart} lockScroll={this.lockScroll} notMobile={this.state.notMobile} checkout={this.checkout}/>

lockScroll just tells React_Page_Scroller to not scroll.
notMobile tells shopping cart if the pages inner width is that of a phone.

checkout has not been built, but looks like the following to verify the products have been added:
  checkout = (products) => {
    this.setState({checkout: true})
    console.log(products);
  }

addToCart creates the cart item that is passed to the app's state (cart):
  addToCart = (item) => {
    if (!this.state.cart.includes(item)){
      this.setState({
        cart: this.state.cart.concat([item]),
      })} else {
        alert('Item already in cart. Adjust quantities in shopping cart.')
      }
  }
