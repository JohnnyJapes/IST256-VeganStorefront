//ANGULAR JS
let productApp = angular.module('productApp', []);
productApp.controller('productController', function ($scope, $controller) {
    $scope.showJSON = false
    $scope.displayJSON = function () {
        $scope.productJSON = {
            productID: $scope.productID,
            productName: $scope.productName,
            description: $scope.description,
            category: $scope.category,
            price: $scope.price,
            weight: $scope.weight,
            unitOfMeasure: $scope.unit
        }
        console.log('angular')
        console.log($scope.productJSON)
        for (key in $scope.productJSON) {
            if ($scope.productJSON[key]) $scope.showJSON = true
        };
    }
    $scope.getProduct = function () {
        $.getJSON("https://ist256.up.ist.psu.edu:3004/product/read", { productID: $scope.productID }, function (data, status) {
            console.log(data)
            console.log(status)
            if (status != 'success') throw "Failed"
            let json = "";
            for (key in data) {
                json += `${key} : ${data[key]} \n`
            }
            //console.log(data.cart)
            console.log("Found product: \n " + json + "\nStatus: " + status);
            $scope.productID = parseInt(data.productID);
            $scope.name = data.productName;
            $scope.description = data.description;
            $scope.category = data.category;
            $scope.price = parseFloat(data.price);
            $scope.weight = parseFloat(data.weight);
            $scope.unit = data.unitOfMeasure;
            $("#add").prop("disabled", true);
            $("#update").prop("disabled", false)
            $("#delete").prop("disabled", false)
            $scope.$apply()
            appendAlert("Product Found. Product JSON: " + JSON.stringify(data), "success");

        }).fail(function () {
            console.log("AJAX product retrieval failed")
            appendAlert("Product Retrieval Failed", "danger");
        });

    }
    $scope.deleteProduct = function () {
        $.ajax({
            url: "https://ist256.up.ist.psu.edu:3004/product/delete",
            //dataType: "json",
            data: { productID: $scope.productID },
            type: "GET",
            crossDomain: true,
        })
            .done(function (data) {
                console.log("Product Deleted: " + data)
                appendAlert("Product deleted. ProductID: " + $scope.productID, "success");
            })
            .fail(function (xhr, status, errorThrown) {
                console.log("ajax product deletion failed")
                console.log("Status: " + status)
                console.log("Error: " + errorThrown)
                console.log("xhr: " + xhr)
                appendAlert("Product Deletion Failed", "danger");

            })
    }

})
function appendAlert(message, type) {
    $("#alertPlaceholder").html(`<div class="alert alert-${type} alert-dismissible" role="alert">` +
        `   <div>${message}</div>` +
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
        '</div>')
}
$(document).ready(function () {

    let alertPlaceholder = $("#alertPlaceholder");
    let editSwitch = $("#AESwitcher");
    let productId = $('#productId');
    let description = $("#description");
    let productName = $("#productName");


    //Other listeners
    productId.on("focusout", (event) => {
        productIdCheck();
    })
    productId.on("input", (event) => {
        productIdCheck();
    })
    description.on("focusout", (event) => {
        descriptionCheck();
    })
    description.on("input", (event) => {
        descriptionCheck();
    })
    $('#category').on("change", (event) => validateCategory());
    $('#price').on("focusout", (event) => validatePrice());
    $('#price').on("input", (event) => validatePrice());
    $('#weight').on("focusout", (event) => validateWeight());
    $('#weight').on("input", (event) => validateWeight());
    $('#unit').on("change", (event) => validateUnit());
    productName.on("input", (event) => validateName());
    productName.on("focusout", (event) => validateName());



    $('#add').on("click", function (event) {
        // Prevent default form submission
        console.log('submit event')
        event.preventDefault();

        // Perform form validation
        if (!formValidation()) {
            return;
        }
        var product = productJson();
        var prodJSON = JSON.stringify(product);
        //update/insert handled server side
        createProduct(product);


    });

    $('#update').on("click", function (event) {
        // Prevent default form submission
        console.log('submit event')
        event.preventDefault();

        // Perform form validation
        if (!formValidation()) {
            return;
        }
        var product = productJson();
        var prodJSON = JSON.stringify(product);
        //update/insert handled server side
        updateProduct(product);

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

        //validate productName
        if (!validateName()) isValid = false;

        return isValid;
    }


    function validateCategory() {
        let category = $('#category');
        const set = new Set(["Vegetables", "Meat Alternative", "Merchandise"])
        if (!set.has(category.val())) {
            console.log(category.val())
            addInvalid(category, "Please Select a Category");
            return false;
        }
        else {
            makeValid(category)
            return true;
        }
    }

    function validatePrice() {
        var price = $('#price');
        if (isNaN(price.val()) || price.val() <= 0) {
            addInvalid(price, "Price should be a positive number");
            return false;
        }
        else {
            makeValid(price)
            return true;
        }
    }
    function validateWeight() {
        // Validate weight
        var weight = $('#weight')
        if (!weight.val()) {
            makeValid(weight);
            return true
        }
        if (isNaN(weight.val()) || weight.val() <= 0) {
            addInvalid(weight, "Weight should be a positive number");
            return false;
        }
        else {
            makeValid(weight)
            return true;
        }
    }

    function validateUnit() {
        let unit = $('#unit');
        const set = new Set(["Grams", "Kilograms", "Ounces", "Pounds", "Liters"])
        if (!set.has(unit.val())) {
            console.log(unit.val())
            addInvalid(unit, "Please Select a Unit of measurement");
            return false;
        }
        else {
            makeValid(unit);
            return true;
        }
    }


    function productIdCheck() {
        if (!productId.val()) {
            addInvalid(productId, "Please enter a valid id");
            return false;
        } else {
            makeValid(productId)
            return true;
        }

    }


    function descriptionCheck() {
        if (!description.val()) {
            addInvalid(description, "Please enter a valid product description");
            return false;
        } else {
            makeValid(description)
            return true;
        }
    }

    function validateName() {
        if (!productName.val()) {
            addInvalid(productName, "Please enter a Product Name.")
            return false;
        }
        else {
            makeValid(productName);
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

    function productJson() {

        let weight;
        console.log($('#weight').val())
        if (!$('#weight').val()) weight = 0;
        else weight = $('#weight').val();

        var product = {
            productID: parseInt($('#productId').val()),
            productName: productName.val(),
            description: $('#description').val(),
            category: $("#category").val(),
            price: parseFloat($('#price').val()),
            weight: parseFloat(weight),
            unitOfMeasure: $("#unit").val()
        };
        return product;
    }
    //ajax to create product
    function createProduct(product) {

        $.ajax({
            url: "https://ist256.up.ist.psu.edu:3004/product/create",
            //dataType: "json",
            data: JSON.stringify(product),
            contentType: "application/json",
            type: "POST",
            crossDomain: true,
        })
            .done(function (data, status) {
                console.log("ajax success, status: " + status)
                appendAlert("Product Created Successfully. Product JSON: " + JSON.stringify(product), "success");
            })
            .fail(function (xhr, status, errorThrown) {
                console.log("Status: " + status)
                console.log("Error: " + errorThrown)
                console.log("xhr: " + xhr)
                appendAlert("Product Creation Unsuccessful.", "danger");
            })
    }
    //ajax for update product
    function updateProduct(product) {
        $.ajax({
            url: "https://ist256.up.ist.psu.edu:3004/product/update",
            //dataType: "json",
            data: JSON.stringify(product),
            contentType: "application/json",
            type: "POST",
            crossDomain: true,
        })
            .done(function (data, status) {
                console.log("ajax success, status: " + status)
                appendAlert("Product Updated Successfully. Product JSON: " + JSON.stringify(product), "success");
            })
            .fail(function (xhr, status, errorThrown) {
                console.log("Status: " + status)
                console.log("Error: " + errorThrown)
                console.log("xhr: " + xhr)
                appendAlert("Product Update Unsuccessful.", "danger");
            })
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
