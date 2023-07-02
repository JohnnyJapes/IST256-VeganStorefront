$(document).ready(function () {
    let alertPlaceholder = $("#alertPlaceholder");
    let editSwitch = document.getElementById("AESwitcher");

    $('#productForm').submit(function (event) {
        // Prevent default form submission
        console.log('submit event')
        event.preventDefault();

        // Perform form validation
        if (!formValidation()) {
            return;
        }

        var product = {
            productID: $('#proId').val(),
            description: $('#description').val,
            weight: $('#weight').val(),
            price: $('#price').val(),
            category: $('#category').val(),
            unit: $('#unit').val()
        };

        if (editSwitch.checked == true) {
            if (matchID(product) >= 0) {
                updateProduct(product, index);
            }
            else {
                appendAlert("Validation Failed: Product ID not found", "danger")
                return;
            }
        }
        // Create JSON from the product object
        if (matchID(product) < 0) {
            createProduct(product);
        }
        else {
            appendAlert("Product ID is already in use", "danger")
            return
        }
        var productJson = JSON.stringify(product);

        if (product)

            // Display the JSON on successful validation
            appendAlert("Form submitted successfully. Product JSON: " + productJson, "success");
    });

    // Form validation function
    function formValidation() {
        var isValid = true;

        //validate product ID
        if (!proIdCheck()) isvalid = false;

        //validate Description
        if (!descriptionCheck()) isvalid = false;

        // Validate weight
        var weight = $('#weight').val();
        if (isNaN(weight) || weight <= 0) {
            isValid = false;
            alert("Weight should be a positive number");
        }

        // Validate price
        var price = $('#price').val();
        if (isNaN(price) || price <= 0) {
            isValid = false;
            alert("Price should be a positive number");
        }

        // Validate category
        var category = $('#category').val();
        if (!category) {
            isValid = false;
            alert("Please select a category");
        }

        // Validate unit
        var unit = $('#unit').val();
        if (!unit) {
            isValid = false;
            alert("Please select a unit of measurement");
        }

        return isValid;
    }

    // //example usage
    // let test = document.getElementById("productid");



    // test.addEventListener("focusout", (event) => {
    //     testCheck();
    // })


    // function testCheck() {
    //     if (!test.value) {
    //         addInvalid(test, "No input");
    //     }
    //     else {
    //         makeValid(test)
    //     }
    //     return
    // }



    let productId = document.getElementById("proId");

    productId.addEventListener("focusout", (event) => {
        proIdCheck();
    })

    function proIdCheck() {
        if (!productId.value) {
            addInvalid(productId, "Please enter a valid id");
            return false;
        } else {
            makeValid(productId)
            return true;
        }

    }

    let description = document.getElementById("description");

    description.addEventListener("focusout", (event) => {
        descriptionCheck();
    })

    function descriptionCheck() {
        if (!description.value) {
            addInvalid(description, "Please enter a valid product description");
            return false;
        } else {
            makeValid(description)
            return true;
        }
    }






    // form.on("submit", submit);
    // emailInput.on("focusout", (event) => {
    //     validateEmail();
    // })
    // emailInput.on("input", (event) => {
    //     validateEmail();
    // })





    function submit2(event) {
        //validation logic here
        event.preventDefault();
        event.stopPropagation();
        let err = 0;
        err += validateEmail();
        err += validateFirstName();
        err += validateLastName();
        err += validateAge();
        err += validateAddress();
        err += validatePhone();
        if (err > 0) return;

        jsonUser = data();
        let json2 = {
            "email": "test2",
            "name": "test name",
            "age": "23",
            "address": addressInput.val(),
            "phone": phoneInput.val()
        }
        //let jsonArr = [jsonUser]
        let jsonArr = []

        try { jsonArr = JSON.parse(alertPlaceholder.data("productStorage")) }
        catch {
            console.log("empty product")
        }

        if (!jsonArr) {
            //return valid
            return true
            // jsonArr = [];
            // jsonArr.push(json2)
            // jsonArr.push(jsonUser)
        }
        else {
            console.log(jsonArr)
            let match = false;
            for (let i = 0; i < jsonArr.length; i++) {
                console.log("loop " + jsonArr[i].email)
                if (jsonArr[i].email == jsonUser.email) match = true
            }
            console.log("match : " + match)
            if (match) {
                //add invalid message
                return
            }
            return

        }

        localStorage.setItem("productStorage", JSON.stringify(jsonArr));



        // $.post("test.json", JSON.stringify(jsonArr), () => {
        //     appendAlert(JSON.stringify(jsonArr), "Success")
        // });
        alertPlaceholder.data("productStorage", JSON.stringify(jsonArr))
        let json = "";
        for (key in jsonUser) {
            json += `${key} : ${jsonUser[key]} <br>`
        }


        console.log(json)
        //appendAlert("Success! <br> Json Shopper Object: <br>" + json, "success")

        jsonArr = JSON.parse(localStorage.getItem("productStorage"));
        appendAlert(JSON.stringify(jsonArr), "success")



    }


    function appendAlert(message, type) {
        alertPlaceholder.html(`<div class="alert alert-${type} alert-dismissible" role="alert">` +
            `   <div>${message}</div>` +
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
            '</div>')
    }

    //checks for duplicate ids when given a JSON object
    //if the id is already in use, function returns the array index of the id
    //if the id is new, function returns -1
    function matchID(newProduct) {
        alertPlaceholder.data("productStorage", localStorage.getItem("productStorage"))
        console.log(alertPlaceholder.data("productStorage"))
        let jsonArr = []


        try { jsonArr = $.parseJSON(alertPlaceholder.data("productStorage")) }
        catch {
            console.log("empty product")
        }


        if (!jsonArr) {
            //json collection is empty, so no match

            return -1
        }
        else {
            console.log(jsonArr)
            let match = false;
            let index = 0;
            for (let i = 0; i < jsonArr.length; i++) {
                console.log("loop " + jsonArr[i].productID)
                if (jsonArr[i].productID == newProduct.productID) {
                    console.log("match: arr: " + jsonArr[i].productID + " new: " + newProduct.productID)
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
    //adds new JSON product to json collection stored in local storage
    //should only be run after matchID() is used to verfiy the productID isn't already in use
    function createProduct(newProduct) {
        alertPlaceholder.data("productStorage", localStorage.getItem("productStorage"))
        console.log(alertPlaceholder.data("productStorage"))


        let jsonArr = []

        //code for when a backend exists
        // $.getJSON("products.json", (data) =>{
        //     if (data){
        //         jsonArr = data;
        //     }
        // })

        //current alternative
        try { jsonArr = $.parseJSON(alertPlaceholder.data("productStorage")) }
        catch {
            console.log("empty product")
        }


        if (!jsonArr) {
            //json collection is empty, create array
            jsonArr = [];
            jsonArr.push(newProduct)
            //update localstorage and jQuery object
            localStorage.setItem("productStorage", JSON.stringify(jsonArr));
            alertPlaceholder.data("productStorage", JSON.stringify(jsonArr));
            return
        }
        else {
            jsonArr.push(newProduct)
            //jQuery code for when a backend exists
            // $.post("test.json", JSON.stringify(jsonArr), () => {
            //     appendAlert("Document added", "Success")
            // });

            //update localstorage and jQuery object
            localStorage.setItem("productStorage", JSON.stringify(jsonArr));
            alertPlaceholder.data("productStorage", JSON.stringify(jsonArr));
            return


        }
    }
    //pass the product object and the index
    function updateProduct(product, index) {
        alertPlaceholder.data("productStorage", localStorage.getItem("productStorage"))
        console.log(alertPlaceholder.data("productStorage"))


        let jsonArr = []

        //code for when a backend exists
        // $.getJSON("products.json", (data) =>{
        //     if (data){
        //         jsonArr = data;
        //     }
        // })

        //current alternative
        try { jsonArr = $.parseJSON(alertPlaceholder.data("productStorage")) }
        catch {
            console.log("empty product")
        }
        if (jsonArr[index] == product.prodcutID) {
            jsonArr[index] = product;
        }

        //jQuery code for when a backend exists
        // $.post("test.json", JSON.stringify(jsonArr), () => {
        //     appendAlert("Document added", "Success")
        // });

        //update localstorage and jQuery object
        localStorage.setItem("productStorage", JSON.stringify(jsonArr));
        alertPlaceholder.data("productStorage", JSON.stringify(jsonArr));
        return


    }

    //pass element and error message
    function addInvalid(element, error) {
        if (element.classList.contains("is-valid")) {
            element.classList.remove("is-valid")
        }
        element.classList.add("is-invalid");
        element.nextElementSibling.textContent = error;

    }
    //pass element
    function makeValid(element) {
        element.classList.remove("is-invalid");
        element.classList.add("is-valid");

    }



})
