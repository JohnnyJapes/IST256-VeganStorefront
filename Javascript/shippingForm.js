//ANGULAR JS
let shippingApp = angular.module('shippingApp', []);
shippingApp.controller('shippingController', function ($scope, $controller) {
    $scope.showJSON = false
    $scope.displayJSON = function () {
        $scope.shippingJSON = {
            address: $scope.address,
            city: $scope.city,
            state: $scope.state,
            zip: $scope.zip,
            carrier: $scope.carrier,
            method: $scope.method
        }
        console.log('angular')
        console.log($scope.shippingJSON)
        for (key in $scope.shippingJSON) {
            if ($scope.shippingJSON[key]) $scope.showJSON = true
        };

    }
})

$(document).ready(function () {
    let form = $("#shippingForm");
    let city = $("#city");
    let address = $("#address");
    let state = $("#state");
    let zip = $("#zipCode");
    let carrier = $("#carrier");
    let method = $("#method");

    form.on("submit", submit);

    function submit() {
        event.preventDefault();
        event.stopPropagation();
        if (!formValidation) {
            return
        }

        shppingAddress = shippingJson();

    }
    // Form validation function
    function formValidation() {
        var isValid = true;

        //validate street address
        if (!validateAddress()) isValid = false;

        //validate City
        if (!validateCity()) isValid = false;

        // Validate State

        // if (!vvalidateState()) isValid = false;

        // Validate zip code

        //if (!validateZipCode()) isValid = false;

        // Validate Carrier
        if (!validateCarrier()) isValid = false;

        // Validate shipping method
        if (!validateShippingMethod()) isValid = false;


        return isValid;
    }

    function validateAddress() {
        const re = /^[0-9]+\s[a-zA-Z\s]+$/gm
        if (!address.val()) {
            addInvalid(address, "Please enter a valid address.")
            return false;
        }

        else if (!re.test(address.val())) {
            addInvalid(address, "Please enter a valid address with a street name and number.")
            return false;
        }
        else {
            makeValid(address);
            return true;
        }

    }
    function validateCity() {
        if (!city.val()) {
            addInvalid(city, "Please enter a valid city.")
            return false;
        }
        else {
            makeValid(city);
            return true;
        }

    }
    function validateCarrier() {
        if (carrier.val() == 0) {
            console.log(carrier.val())
            addInvalid(carrier, "Please Select a Category");
            return false;
        }
        else {
            makeValid(carrier)
            return true;
        }
    }
    function validateShippingMethod() {

        if (method.val() == 0) {
            console.log(method.val())
            addInvalid(method, "Please Select a Method");
            return false;
        }
        else {
            makeValid(method)
            return true;
        }
    }

    //AJAX FUNCTIONS
    function getShippingInfo() {


        $.get("Placeholder API", function (data, status) {
            //console.log(data.cart)
            alert("Data: " + JSON.stringify(data) + "\nStatus: " + status);
            for (let i = 0; i < data.length; i++) {
                shippingAddress.addItem(data[i])
            }
        }).fail(function () {
            console.log("AJAX shipping retrieval failed")
        });
    }

    function updateShipping() {
        $.post("restfulapi to post to", { shippingAddress }, function (data, status) {
            alert("Data: " + data + "\nStatus: " + status)
        }).fail(function () {
            console.log("AJAX shipping update failed")
        });;


    }
    function shippingJson() {
        let shippingAddress = {
            address: address.val(),
            city: city.val(),
            state: state.val(),
            zip: zip.val(),
            carrier: carrier.val(),
            method: method.val()
        }
        return shippingAddress;
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

