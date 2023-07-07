// Defining the Cart Class
class Cart {
    constructor() {
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
        this.updateCart();
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.updateCart();
    }

    updateItemQuantity(index, quantity) {
        this.items[index].quantity = quantity;
        this.updateCart();
    }

    getTotal() {
        let total = 0;
        for (let i = 0; i < this.items.length; i++) {
            total += this.items[i].price * this.items[i].quantity;
        }
        return total;
    }

    updateCart() {
        $('#cart').empty();
        console.log("Update cart")
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            $('#cart').append(`
                <div class="cartItem" >
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${item.product}</h5>
                            <p class="card-text">Price: ${item.price}</p>
                            <p class="card-text">Description: ${item.description}</p>
                            <label for="quantity" class="form-label">Quantity:</label>
                            <div class="input-group mb-3" id="quantity">
                                <input type="number" class="form-control" value="${item.quantity}" onchange="cart.updateItemQuantity(${i}, this.value)">
                            </div>
                            <a href="#" class="btn btn-primary" onclick="cart.removeItem(${i})">Remove</a>
                        </div>
                    </div>
                </div>
            `);
        }

        $('#total').val(this.getTotal());
    }
}

// Initialize Cart
let cart = new Cart();

// On document ready
$(document).ready(function () {
    $('#checkOut').click(function () {
        // Handle Checkout
        // This part can be customized according to your needs
        alert('Checking out. Thank you for your purchase!');
    });

    $('#addItem').click(function () {
        // Add Item
        // Add your logic here to get the item to be added
        let item = {
            product: 'New Product',
            price: 20.00,
            quantity: 1,
            description: 'New Product Description'
        };

        cart.addItem(item);
    });
});
