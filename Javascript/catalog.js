$(document).ready(function () {
    let container = $("#productContainer");

    //alertPlaceholder.data("productStorage", localStorage.getItem("productStorage"))
    //console.log(alertPlaceholder.data("productStorage"))
    let cartArr = []


    try { cartArr = $.parseJSON(localStorage.getItem("cart")) }
    catch {
        console.log("empty cart")
        cartArr = []
    }
    if (!cartArr) {
        cartArr = []
    }
    let productArray = []


    try { productArray = $.parseJSON(localStorage.getItem("productStorage")) }
    catch {
        console.log("empty product")
        productArray = []
    }


    if (!productArray) {
        //json collection is empty, so no match
        container.html("<h1> No products are available at this time. Add products in Product Management</h1>")
    }
    else {
        container.html("<h1> PRODUCTS</h1>")
        for (let i = 0; i < productArray.length; i++) {
            container.append(`
            <div class="col-md-4 justify-content-center" id="${productArray[i].productID}">
                <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title mb-2 text-truncate">${productArray[i].productName}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">ID: ${productArray[i].productID}</h6>
                    <p class="card-text text-truncate">${productArray[i].description}</p>
                    <p class="card-text">\$${productArray[i].price}</p>
                    <button class="btn btn-primary">Add to Cart</button>
                </div>
                <div class="card-footer">
                ${productArray[i].category}
                </div>
            </div>
        </div>`)
            $(`#${productArray[i].productID} .card-body  button`).on("click", (event) => {
                let index = matchID(productArray[i])
                if (index < 0) {
                    let cartItem = {
                        product: productArray[i],
                        quantity: 1
                    }
                    cartArr.push(cartItem)
                    localStorage.setItem("cart", JSON.stringify(cartArr))
                }
                else {
                    cartArr[index].quantity += 1;
                    localStorage.setItem("cart", JSON.stringify(cartArr))
                }
            })
        }
    }

    function matchID(product) {
        //console.log(alertPlaceholder.data("productStorage"))


        if (!cartArr) {
            //json collection is empty, so no match

            return -1
        }
        else {
            console.log(cartArr)
            let match = false;
            let index = 0;
            for (let i = 0; i < cartArr.length; i++) {
                console.log("loop " + cartArr[i].productID)
                if (cartArr[i].product.productID == product.productID) {
                    console.log("match: arr: " + cartArr[i].product.productID + " new: " + product.productID)
                    match = true
                    index = i;
                }
            }
            console.log("match : " + match)
            if (match) {
                return index
            }
            return -1


        }

    }

})