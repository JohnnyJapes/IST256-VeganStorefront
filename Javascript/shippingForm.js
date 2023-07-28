//AJAX FUNCTIONS
function getShippingInfo() {
    let session = "";
    let name = "session";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            session = c.substring(name.length, c.length);
        }
    }

    $.get("http://localhost:3004/shipping", session, function (data, status) {
        //console.log(data.cart)
        alert("Data: " + JSON.stringify(data) + "\nStatus: " + status);

    }).fail(function () {
        console.log("AJAX shipping retrieval failed")
    });
}





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

    //jQuery Listeners
    form.on("submit", submit);
    city.on("input", validateCity);
    city.on("focusout", validateCity);
    address.on("input", validateAddress);
    address.on("focusout", validateAddress);
    state.on("input", validateState);
    state.on("focusout", validateState);
    zip.on("input", validateZIP);
    zip.on("focusout", validateZIP);
    carrier.on("change", validateCarrier);
    method.on("change", validateShippingMethod);


    function submit() {
        event.preventDefault();
        event.stopPropagation();
        console.log("submit")
        if (!formValidation()) {
            appendAlert("Some fields are invalid.", "danger");
            return
        }
        updateShipping();
        appendAlert("Successfully Submitted", "success");
    }
    // Form validation function
    function formValidation() {
        var isValid = true;

        //validate street address
        if (!validateAddress()) isValid = false;

        //validate City
        if (!validateCity()) isValid = false;

        // Validate State

        if (!validateState()) isValid = false;

        // Validate zip code

        if (!validateZIP()) isValid = false;

        // Validate Carrier
        if (!validateCarrier()) isValid = false;

        // Validate shipping method
        if (!validateShippingMethod()) isValid = false;


        return isValid;
    }
    //Individual Validation functions

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
        if (!carrier.val()) {
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

        if (!method.val()) {
            console.log(method.val())
            addInvalid(method, "Please Select a Shipping Method");
            return false;
        }
        else {
            makeValid(method)
            return true;
        }
    }
    // ZIP validation function
    function validateZIP() {
        const regex = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
        if (!zip.val()) {
            addInvalid(zip, "Please enter a ZIP code.");
            return false;
        }
        else if (!regex.test(zip.val())) {
            addInvalid(zip, "Please enter a valid ZIP code.");
            return false;
        }
        else {
            makeValid(zip);
            return true;
        }
    }
    // State validation function
    function validateState() {
        const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
        if (!state.val()) {
            addInvalid(state, "Please enter a state.");
            return false;
        }
        else if (!states.includes(state.val().toUpperCase())) {
            addInvalid(state, "Please enter a valid state abbreviation.");
            return false;
        }
        else {
            makeValid(state);
            return true;
        }
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
    function appendAlert(message, type) {
        let alertPlaceholder = $("#alertPlaceholder");
        alertPlaceholder.html(`<div class="alert alert-${type} alert-dismissible" role="alert">` +
            `   <div>${message}</div>` +
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
            '</div>')
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
    function updateShipping() {
        // $.post("restfulapi to post to", { shippingJSON() }, function (data, status) {
        //     alert("Data: " + data + "\nStatus: " + status)
        // }).fail(function () {
        //     console.log("AJAX shipping update failed")
        // });
        $.ajax({
            url: "http://localhost:3004/shipping",
            data: JSON.stringify(shippingJson()),
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
})

