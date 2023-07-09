$(document).ready(function () {
    let alertPlaceholder = $("#alertPlaceholder");
    let editSwitch = $("#AESwitcher");
    let productId = document.getElementById("productId");
    let description = document.getElementById("description");
    let name = $("#productName");

    //initiate switch logic
    if (editSwitch.prop("checked") == true) {
        $("#add").prop("disabled", true);
        $("#update").prop("disabled", false)
    }
    else {
        $("#add").prop("disabled", false);
        $("#update").prop("disabled", true)
    }
    //listen for further changes
    editSwitch.on("change", (event) => {
        console.log("switch")
        if (editSwitch.prop("checked") == true) {
            $("#add").prop("disabled", true);
            $("#update").prop("disabled", false)
        }
        else {
            $("#add").prop("disabled", false);
            $("#update").prop("disabled", true)
        }
    })


    //Other listeners
    productId.addEventListener("focusout", (event) => {
        productIdCheck();
    })
    productId.addEventListener("input", (event) => {
        productIdCheck();
    })
    description.addEventListener("focusout", (event) => {
        descriptionCheck();
    })
    description.addEventListener("input", (event) => {
        descriptionCheck();
    })
    $('#category').on("change", (event) => validateCategory());
    $('#price').on("focusout", (event) => validatePrice());
    $('#price').on("input", (event) => validatePrice());
    $('#weight').on("focusout", (event) => validateWeight());
    $('#weight').on("input", (event) => validateWeight());
    $('#unit').on("change", (event) => validateUnit());
    name.on("input", (event) => validateName());
    name.on("focusout", (event) => validateName());





    $('#productForm').submit(function (event) {
        // Prevent default form submission
        console.log('submit event')
        event.preventDefault();

        // Perform form validation
        if (!formValidation()) {
            return;
        }

        //map select inputs
        let category;
        let unit;
        switch (parseInt($("#category").val())) {
            case 1: category = "Vegetables";
                break;
            case 2: category = "Meat Alternative";
                break;
            case 3: category = "Merchandise";
                break;
        }
        switch (parseInt($("#unit").val())) {
            case 1: unit = "Grams";
                break;
            case 2: unit = "Kilograms";
                break;
            case 3: unit = "Ounces";
                break;
            case 4: unit = "Pounds";
                break;
            case 5: unit = "Liters";
                break;
        }
        let weight;
        console.log($('#weight').val())
        if (!$('#weight').val()) weight = 0;
        else weight = $('#weight').val();

        var product = {
            productID: $('#productId').val(),
            productName: name.val(),
            description: $('#description').val(),
            category: category,
            price: $('#price').val(),
            weight: weight,
            unitOfMeasure: unit
        };

        if (editSwitch.prop("checked") == true) {
            let index = matchID(product);
            if (index >= 0) {
                updateProduct(product, index);
            }
            else {
                appendAlert("Validation Failed: Product ID not found", "danger")
                return;
            }
        }
        // Create JSON from the product object
        else if (matchID(product) < 0) {
            createProduct(product);
        }
        else {
            appendAlert("Product ID is already in use", "danger")
            return
        }
        var productJson = JSON.stringify(product);

        if (product) {
            // Display the JSON on successful validation
            if (editSwitch.prop("checked") == true) {
                appendAlert("Product Updated Successfully. Product JSON: " + productJson, "success");
            }
            else
                appendAlert("Product Added successfully. Product JSON: " + productJson, "success");
        }

    });

    // Form validation function
    function formValidation() {
        var isValid = true;

        //validate product ID
        if (!productIdCheck()) isValid = false;

        //validate Description
        if (!descriptionCheck()) isValid = false;

        // Validate category
        if (!validateCategory()) {
            isValid = false;
        }
        // Validate weight
        if (!validateWeight()) isValid = false;
        // Validate price
        if (!validatePrice()) isValid = false;

        // Validate unit
        if (!validateUnit()) isValid = false;

        //validate name
        if (!validateName()) isValid = false;

        return isValid;
    }


    function validateCategory() {
        let category = $('#category');
        const set = new Set([1, 2, 3])
        if (!set.has(parseInt(category.val()))) {
            console.log(category.val())
            category.addClass("is-invalid");
            category.next().text("Please Select a Category");
            return false;
        }
        else {
            category.removeClass("is-invalid");
            category.addClass("is-valid");
            return true;
        }
    }

    function validatePrice() {
        var price = $('#price');
        if (isNaN(price.val()) || price.val() <= 0) {
            price.addClass("is-invalid");
            price.next().text("Price should be a positive number");
            return false;
        }
        else {
            price.removeClass("is-invalid");
            price.addClass("is-valid");
            return true;
        }
    }
    function validateWeight() {
        // Validate weight
        var weight = $('#weight').val();
        if (!weight) {
            $('#weight').removeClass("is-invalid");
            $('#weight').addClass("is-valid");
            return true
        }
        if (isNaN(weight) || weight <= 0) {
            $('#weight').addClass("is-invalid");
            $('#weight').next().text("Weight should be a positive number");
            return false;
        }
        else {
            $('#weight').removeClass("is-invalid");
            $('#weight').addClass("is-valid");
            return true;
        }
    }

    function validateUnit() {
        let unit = $('#unit');
        const set = new Set([1, 2, 3, 4, 5])
        if (!set.has(parseInt(unit.val()))) {
            console.log(unit.val())
            unit.addClass("is-invalid");
            unit.next().text("Please Select a Unit of measurement");
            return false;
        }
        else {
            unit.removeClass("is-invalid");
            unit.addClass("is-valid");
            return true;
        }
    }


    function productIdCheck() {
        if (!productId.value) {
            addInvalid(productId, "Please enter a valid id");
            return false;
        } else {
            makeValid(productId)
            return true;
        }

    }


    function descriptionCheck() {
        if (!description.value) {
            addInvalid(description, "Please enter a valid product description");
            return false;
        } else {
            makeValid(description)
            return true;
        }
    }

    function validateName() {
        if (!name.val()) {
            addInvalid(name, "Please enter a Product Name.")
            return false;
        }
        else {
            makeValid(name);
            return true;
        }

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
        //console.log(alertPlaceholder.data("productStorage"))
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
        //console.log(alertPlaceholder.data("productStorage"))


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
        if (jsonArr[index].productID == product.productID) {
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
        try {
            if (element.classList.contains("is-valid")) {
                element.classList.remove("is-valid")
            }
            element.classList.add("is-invalid");
            element.nextElementSibling.textContent = error;

        } catch (e) {
            if (element.hasClass("is-valid")) element.removeClass("is-valid");
            element.addClass("is-invalid");
            element.next().text(error);
        }

    }
    //pass element
    function makeValid(element) {
        try {
            element.classList.remove("is-invalid");
            element.classList.add("is-valid");

        } catch (error) {
            element.removeClass("is-invalid");
            element.addClass("is-valid");


        }


    }





})
