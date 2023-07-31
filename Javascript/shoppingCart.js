// Defining the Cart Class
class Cart {
    constructor() {
        this.items = [];
    }

    addItem(item) {
        let index = this.checkDuplicate(item.productID)
        console.log(index)
        if (item.quantity != null) {
            this.items.push(item);
        }

        else if (index >= 0) {
            this.items[index].quantity++
        }
        else {
            let newItem = {
                product: item,
                quantity: 1
            }
            this.items.push(newItem);
        }

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
    checkDuplicate(id) {
        let index = -1;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].product.productID == id) {
                index = i;
            }
        }
        return index;
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
                            <div class="input-group mb-1" id="quantity">
                                <input type="number" class="form-control" value="${item.quantity}" onchange="cart.updateItemQuantity(${i}, this.value)">
                            </div>
                            <p class="card-text">Total: ${item.product.price * item.quantity}</p>
                            <button class="btn btn-danger" onclick="cart.removeItem(${i})">Remove</button>
                        </div>
                    </div>
                </div>
            `);
        }
        var jsd = JSON.stringify(this.items);
        localStorage.setItem("cart", jsd)
        let sum = this.getTotal();
        console.log(sum)
        $('#total').val(sum.toFixed(2));
    }
}

// Initialize Cart
let cart = new Cart();
let products = [];
// On document ready
$(document).ready(function () {
    let alertPlaceholder
    // loadCart();
    alertPlaceholder = $("#alertPlaceholder");
    cart.updateCart();
    getProducts();
    loadProductStorage();
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
        value = $('#productSelect').val()
        index = findItem(value);
        console.log(index)
        cart.addItem(products[index]);
    });
    //load cart from local storage
    // function loadCart() {
    //     let cartArr = []
    //     try { cartArr = $.parseJSON(localStorage.getItem("cart")) }
    //     catch {
    //         console.log("empty cart")
    //         cartArr = []
    //     }
    //     if (!cartArr) {
    //         cartArr = []
    //     }
    //     else {
    //         for (let i = 0; i < cartArr.length; i++) {
    //             cart.addItem(cartArr[i])
    //         }
    //     }
    // }

    function getCartInfo() {
        let id = "guest";
        let name = "session";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                id = c.substring(name.length + 1, c.length);
            }
        }
        if (id != "guest") {

            $.get("https://ist256.up.ist.psu.edu:3004/cart", { owner: id }, function (data, status) {
                console.log(data.product)
                console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
                for (let i = 0; i < data.length; i++) {
                    cart.addItem(data[i])
                }
            }).fail(function () {
                console.log("AJAX cart retrieval failed")
            });
        }
    }
    function getProducts() {
        $.getJSON("https://ist256.up.ist.psu.edu:3004/product", function (data, status) {
            //alert("Data: " + JSON.stringify(data) + "\nStatus: " + status);
            for (let i = 0; i < data.length; i++) {
                products.push(data[i])
                $("#productSelect").append(`
                <option value=${data[i].productID}>${data[i].productName}</option>`)
            }
        }).fail(function () {
            console.log("AJAX PRODUCT FAIL")

            console.log(products[0])
        });
    }

    function updateCart() {
        let id = "guest";
        let name = "session";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                id = c.substring(name.length + 1, c.length);
            }
        }
        var cartProducts = JSON.stringify(cart.items);
        var cart = {
            cart: cartProducts,
            owner: session
        }
        $.ajax({
            url: "https://ist256.up.ist.psu.edu:3004/cart",
            data: JSON.stringify(cart),
            //dataType: "json",
            type: "POST",
            contentType: "application/json",
            crossDomain: true,
        })
            .done(function () { console.log("ajax success") })
            .fail(function (xhr, status, errorThrown) {
                console.log("Status: " + status)
                console.log("Error: " + errorThrown)
                console.log("xhr: " + xhr)
            })


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
    function findItem(id) {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].productID == id) {
                index = i;
            }
        }
        return index;

    }
    function loadProductStorage() {
        // try {
        //     productArray = $.parseJSON(localStorage.getItem("productStorage"))
        //     for (let i = 0; i < productArray.length; i++) {
        //         products.push(productArray[i])
        //         $("#productSelect").append(`
        //     <option value=${productArray[i].productID}>${productArray[i].productName}</option>`)
        //     }
        // }
        // catch {
        //     console.log("empty product")
        //     productArray = []
        // }

        let item = {

            productName: 'Test Product',
            productID: 35,
            price: 20.00,
            description: 'New Product Description'

        };
        $("#productSelect").append(`
        <option value=${item.productID}>${item.productName}</option>`)
        products.push(item);
        item = {

            productName: 'Testing Product 2',
            productID: 40,
            price: 29.99,
            description: 'New Product Description'

        };
        $("#productSelect").append(`
        <option value=${item.productID}>${item.productName}</option>`)
        products.push(item);
        item = {

            productName: 'Testing Product 3',
            productID: 56,
            price: 6.99,
            description: 'New Product Description'

        };
        $("#productSelect").append(`
        <option value=${item.productID}>${item.productName}</option>`)
        products.push(item);
    }
});


