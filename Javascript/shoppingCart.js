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
        var jsd = JSON.stringify(this.items);
        localStorage.setItem("cart", jsd)
        this.updateCart();
    }

    updateItemQuantity(index, quantity) {
        this.items[index].quantity = quantity;
        this.updateCart();
    }

    getTotal() {
        let total = 0;
        for (let i = 0; i < this.items.length; i++) {
            total += this.items[i].product.price * this.items[i].quantity;
        }
        return total;
    }

    updateCart() {
        $('#cart').empty();
        console.log("Update cart")
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            console.log(item)
            $('#cart').append(`
                <div class="cartItem mb-3 mx-2 px-2 row" >
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${item.product.productName}</h5>
                            <h6 class="card-subtitle mb-2 text-body-secondary">ID: ${item.product.productID}</h6>
                            <p class="card-text">Price: ${item.product.price}</p>
                            <p class="card-text text-truncate">Description: ${item.product.description}</p>
                            <label for="quantity" class="form-label">Quantity:</label>
                            <div class="input-group mb-3" id="quantity">
                                <input type="number" class="form-control" value="${item.quantity}" onchange="cart.updateItemQuantity(${i}, this.value)">
                            </div>
                            <p class="card-text">Total: ${item.product.price * item.quantity}</p>
                            <a href="#" class="btn btn-danger" onclick="cart.removeItem(${i})">Remove</a>
                        </div>
                    </div>
                </div>
            `);
        }
        let sum = this.getTotal();
        console.log(sum)
        $('#total').val(sum.toFixed(2));
    }
}

// Initialize Cart
let cart = new Cart();
// On document ready
$(document).ready(function () {

    let alertPlaceholder
    loadCart();
    alertPlaceholder = $("#alertPlaceholder");
    cart.updateCart();
    getProducts();
    getCartInfo();
    $('#checkOut').click(function () {
        // Handle Checkout
        // This part can be customized according to your needs
        updateJSONtext();
        //getUserInfo();
        updateCart();
        //sendUser();
        //alert('Checking out. Thank you for your purchase!');
        appendAlert("Proceeding to next step of checkout.", "success")
    });

    $('#addItem').click(function () {
        // Add Item
        // Add your logic here to get the item to be added
        let item = {
            product: {
                productName: 'New Product',
                price: 20.00,
                description: 'New Product Description'
            },
            quantity: 1,

        };

        cart.addItem(item);
    });
    //load cart from local storage
    function loadCart() {
        let cartArr = []
        try { cartArr = $.parseJSON(localStorage.getItem("cart")) }
        catch {
            console.log("empty cart")
            cartArr = []
        }
        if (!cartArr) {
            cartArr = []
        }
        else {
            for (let i = 0; i < cartArr.length; i++) {
                cart.addItem(cartArr[i])
            }
        }
    }

    function getCartInfo() {

        $.get("Placeholder API", function (data, status) {
            console.log(data.product)
            alert("Data: " + JSON.stringify(data) + "\nStatus: " + status);
        }).fail(function () {
            console.log("AJAX CART FAIL")
        });
    }
    function getProducts() {
        $.getJSON("products.json", function (data, status) {
            alert("Data: " + JSON.stringify(data) + "\nStatus: " + status);

        }).fail(function () {
            console.log("AJAX PRODUCT FAIL")
        });
    }

    function updateCart() {
        $.post("restfulapi to post to", { cart }, function (data, status) {
            alert("Data: " + data + "\nStatus: " + status)
        }).fail(function () {
            console.log("AJAX CART FAIL")
        });;

    }

    function updateJSONtext() {
        var jsd = JSON.stringify(cart.items);
        $("#JSONtext").text("JSON: " + jsd);
    }
    function updateTotal() {
        let sum = cart.getTotal();
        $("#total").val(sum);
    }

    function appendAlert(message, type) {
        alertPlaceholder.html(`<div class="alert alert-${type} alert-dismissible" role="alert">` +
            `   <div>${message}</div>` +
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
            '</div>')
    }

});


