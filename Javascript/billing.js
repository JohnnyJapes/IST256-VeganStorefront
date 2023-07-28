//AJAX FUNCTIONS
function getbillingInfo() {
    let id = "";
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

    $.getJSON("http://130.203.136.203:3004/billing", { session: id }, function (data, status) {
        console.log(data)
        let json = "";
        for (key in data) {
            json += `${key} : ${data[key]} \n`
        }
        //console.log(data.cart)
        alert("Found Address for Account: \n " + json + "\nStatus: " + status);

    }).fail(function () {
        console.log("AJAX billing retrieval failed")
    });
}





//ANGULAR JS
let billingApp = angular.module('billingApp', []);
billingApp.controller('billingController', function ($scope, $controller) {
    getbillingInfo()
    $scope.showJSON = false
    $scope.displayJSON = function () {
        $scope.billingJSON = {
            card: {
                name: $scope.fName + " " + $scope.lName,
                number: $scope.cardNum,
                cvv: $scope.cvvNum,
                expiration: {
                    month: $scope.month,
                    year: $scope.year
                }
            },
            billingAddress: {
                address: $scope.address,
                city: $scope.city,
                state: $scope.state,
                zip: $scope.zip
            }
        }
        console.log('angular')
        console.log($scope.billingJSON)
        for (key in $scope.billingJSON) {
            if ($scope.billingJSON[key]) $scope.showJSON = true
        };

    }
})

$(document).ready(function () {
    let form = $("#billingForm");
    let city = $("#city");
    let address = $("#address");
    let state = $("#state");
    let zip = $("#zipCode");
    let cardNum = $("#cardNum");
    let cvv = $("#cvvNum");
    let monthIn = $("#month");
    let yearIn = $("#year");
    let fNameInput = $("#fName");
    let lNameInput = $("#lName");

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

    cardNum.on("input", validateCardNum);
    cardNum.on("focusout", validateCardNum);

    cvv.on("input", validateCvvNum);
    cvv.on("focusout", validateCvvNum);

    monthIn.on("input", validateMonth);
    monthIn.on("focusout", validateMonth);

    yearIn.on("input", validateYear);
    yearIn.on("focusout", validateYear);

    fNameInput.on("focusout", (event) => {
        validateFirstName();
    })
    fNameInput.on("input", (event) => {
        validateFirstName();
    })
    lNameInput.on("focusout", (event) => {
        validateLastName();
    })
    lNameInput.on("input", (event) => {
        validateLastName();
    })


    function submit() {
        event.preventDefault();
        event.stopPropagation();
        console.log("submit")
        if (!formValidation()) {
            appendAlert("Some fields are invalid.", "danger");
            return
        }
        updatebilling();
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

        if (!validateFirstName()) isValid = false;

        if (!validateLastName()) isValid = false;
        if (!validateCardNum()) isValid = false;

        if (!validateCvvNum()) isValid = false;
        if (!validateMonth()) isValid = false;
        if (!validateYear()) isValid = false;


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
    function validateFirstName() {
        //regex to check that it is a single word
        const re = /^[a-zA-z]+$/gm
        if (!fNameInput.val()) {
            fNameInput.addClass("is-invalid");
            $("#fName + .invalid-feedback").text("Please enter a name.")
            return 1;
        }
        if (!re.test(fNameInput.val())) {
            fNameInput.addClass("is-invalid");
            $("#fName + .invalid-feedback").text("Please enter a valid name. Name must not contain numbers, special characters, or spaces.")
            return 1;
        }
        fNameInput.removeClass("is-invalid");
        fNameInput.addClass("is-valid");
        return 0;
    }
    function validateLastName() {
        //regex to check that it is a single word
        const re = /^[a-zA-z]+$/gm
        if (!lNameInput.val()) {
            lNameInput.addClass("is-invalid");
            $("#lName + .invalid-feedback").text("Please enter a name.")
            return 1;
        }
        if (!re.test(lNameInput.val())) {
            lNameInput.addClass("is-invalid");
            $("#lName + .invalid-feedback").text("Please enter a first and last name. Name must not contain numbers or special characters.")
            return 1;
        }
        lNameInput.removeClass("is-invalid");
        lNameInput.addClass("is-valid");
        return 0;
    }
    function validateCardNum() {
        if (!cardNum.val()) {
            addInvalid(cardNum, 'Please enter a valid card number.');
            return false;
        }

        else if (cardNum.val().length != 16) {
            addInvalid(cardNum, 'Please enter a valid card number.');
            return false;
        }

        else {
            makeValid(cardNum);
            return true;
        }
    }
    function validateCvvNum() {
        if (!cvv.val()) {
            addInvalid(cvv, 'Please enter a valid cvv number.');
            return false;
        }

        else if (cvv.val().length != 3) {
            addInvalid(cvv, 'Please enter a valid cvv number.');
            return false;
        }

        else {
            makeValid(cvv);
            return true;
        }
    }

    function validateMonth() {
        if (!monthIn.val()) {
            addInvalid(monthIn, 'Please enter a valid month value.');
            return false;

        }

        else if (parseInt(monthIn.val()) < 1 || parseInt(monthIn.val()) > 12) {
            addInvalid(monthIn, 'Please enter a valid month value.');
            return false;
        }

        else {
            console.log(monthIn.val())
            makeValid(monthIn);
            return true;
        }
    }

    function validateYear() {
        if (!yearIn.val()) {
            addInvalid(yearIn, "Please enter a valid year.");
            return false;
        }

        else if (yearIn.val().length != 2) {
            addInvalid(yearIn, "Please enter a valid year.");
            return false;
        }

        else {
            makeValid(yearIn);
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
    function billingJson() {
        let session = "guest";
        let name = "session";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                session = c.substring(name.length + 1, c.length);
            }
        }
        let billing = {
            card: {
                name: $("#fName").val() + " " + $("#lName").val(),
                number: $("#cardNum").val(),
                cvv: $("#cvvNum").val(),
                expiration: {
                    month: $("#month").val(),
                    year: $("#year").val()
                }
            },
            billingAddress: {
                address: address.val(),
                city: city.val(),
                state: state.val(),
                zip: zip.val(),
            },
            owner: session

        }
        return billing;
    }
    function updatebilling() {
        // $.post("restfulapi to post to", { billingJSON() }, function (data, status) {
        //     alert("Data: " + data + "\nStatus: " + status)
        // }).fail(function () {
        //     console.log("AJAX billing update failed")
        // });
        $.ajax({
            url: "http://localhost:3004/billing",
            data: JSON.stringify(billingJson()),
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

