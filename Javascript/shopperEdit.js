//ANGULAR JS
let shopperApp = angular.module('shopperApp', []);
shopperApp.controller('shopperController', function ($scope, $controller) {
    $scope.showJSON = false
    $scope.displayJSON = function () {
        $scope.shopperJSON = {
            email: $scope.email,
            name: $scope.fName + " " + $scope.lName,
            age: parseInt($scope.age),
            address: $scope.address,
            phone: $scope.phone
        }
        console.log('angular')
        console.log($scope.shopperJSON)
        for (key in $scope.shopperJSON) {
            if ($scope.shopperJSON[key]) $scope.showJSON = true
        };
    }
    $scope.getShopper = function () {
        $.getJSON("https://ist256.up.ist.psu.edu:3004/shopper/read", { email: $scope.email }, function (data, status) {
            console.log(data)
            console.log(status)
            if (status != 'success') throw "Failed"
            let json = "";
            for (key in data) {
                json += `${key} : ${data[key]} \n`
            }
            //console.log(data.cart)
            console.log("Found shopper: \n " + json + "\nStatus: " + status);
            let names = data.name.split(' ')
            $scope.email = data.email;
            $scope.fName = names[0]
            $scope.lName = names[1]
            $scope.age = parseInt(data.age)
            $scope.address = data.address;
            $scope.phone = data.phone
            $("#update").prop("disabled", false)
            $("#delete").prop("disabled", false)
            $scope.$apply()
            appendAlert("Shopper Found. Shopper JSON: " + JSON.stringify(data), "success");

        }).fail(function () {
            console.log("AJAX shopper retrieval failed")
            appendAlert("Shopper Retrieval Failed", "danger");
        });

    }
    $scope.deleteShopper = function () {
        $.ajax({
            url: "https://ist256.up.ist.psu.edu:3004/shopper/delete",
            //dataType: "json",
            data: { email: $scope.email },
            type: "GET",
            crossDomain: true,
        })
            .done(function (data) {
                console.log("Shopper Deleted: " + data)
                appendAlert("Shopper deleted. Email: " + $scope.email, "success");
            })
            .fail(function (xhr, status, errorThrown) {
                console.log("ajax shopper deletion failed")
                console.log("Status: " + status)
                console.log("Error: " + errorThrown)
                console.log("xhr: " + xhr)
                appendAlert("Shopper Deletion Failed", "danger");

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
    let form = $("#userForm");
    console.log("sdf")
    let emailInput = $("#email");
    let fNameInput = $("#fName");
    let lNameInput = $("#lName");
    let ageInput = $("#age");
    let addressInput = $("#address");
    let phoneInput = $("#phonenum");
    let alertPlaceholder = $("#alertPlaceholder");


    //form.on("submit", submit);
    emailInput.on("focusout", (event) => {
        validateEmail();
    })
    emailInput.on("input", (event) => {
        validateEmail();
    })
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
    ageInput.on("focusout", (event) => {
        validateAge();
    })
    ageInput.on("input", (event) => {
        validateAge();
    })
    addressInput.on("focusout", (event) => {
        validateAddress();
    })
    addressInput.on("input", (event) => {
        validateAddress();
    })
    phoneInput.on("focusout", (event) => {
        validatePhone();
    })
    phoneInput.on("input", (event) => {
        validatePhone();
    })

    $('#update').on("click", function (event) {
        //validation logic here
        event.preventDefault();
        event.stopPropagation();
        if (!validateAll()) {
            appendAlert("Submission not successful, please check fields for mistakes.", "danger")
            return;
        }

        jsonUser = data();

        let json = "";
        for (key in jsonUser) {
            json += `${key} : ${jsonUser[key]} <br>`
        }
        console.log(json)
        $.ajax({
            url: "https://ist256.up.ist.psu.edu:3004/shopper/update",
            data: JSON.stringify(jsonUser),
            //dataType: "json",
            type: "POST",
            contentType: "application/json",
            crossDomain: true,
        })
            .done(function () {
                console.log("ajax success")
                appendAlert("Success! Updated Shopper!. <br> Json Shopper Object: <br>" + json, "success")
            })
            .fail(function (xhr, status, errorThrown) {
                console.log("Status: " + status)
                console.log("Error: " + errorThrown)
                console.log("xhr: " + xhr)
                appendAlert("Shopper Update Unsuccessful.", "danger");
            })




    });
    function validateAll() {
        let valid = true;
        if (validateEmail() > 0) valid = false;
        if (validateAge() > 0) valid = false;
        if (validateFirstName() > 0) valid = false;
        if (validateLastName() > 0) valid = false;
        if (validatePhone() > 0) valid = false;
        if (validateAddress() > 0) valid = false;
        if (valid) return true;
        else return false;

    }
    //fucntion for email validation
    //checks for @ sign and that the input isn't empty
    function validateEmail() {
        //regex to validate @ sign
        const re = new RegExp("[a-zA-Z0-9]+@[a-zA-Z0-9]+", "gm")
        if (!emailInput.val()) {
            emailInput.addClass("is-invalid");
            $("#email + .invalid-feedback").text("Email Address Required.")
            return 1;
        }
        if (!re.test(emailInput.val())) {
            emailInput.addClass("is-invalid");
            $("#email + .invalid-feedback").text("Invalid Email Address. Please enter a valid Email address. Ex: Jack@google.com")
            return 1;
        }
        emailInput.removeClass("is-invalid");
        emailInput.addClass("is-valid");
        return 0;
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
    function validateAge() {
        //check for input and that the input is an integer
        if (!parseInt(ageInput.val())) {
            ageInput.addClass("is-invalid");
            $("#age + .invalid-feedback").text("Please enter a valid age.")
            return 1;
        }
        //check over 17
        if (parseInt(ageInput.val()) < 18) {
            ageInput.addClass("is-invalid");
            console.log("age error")
            $("#age + .invalid-feedback").text("Invalid age. Please enter a number above 17.")
            return 1;
        }
        //check under 110
        if (parseInt(ageInput.val()) > 110) {
            ageInput.addClass("is-invalid");
            console.log("age")
            $("#age + .invalid-feedback").text("Invalid age. Please enter a number under 110.")
            return 1;
        }
        ageInput.removeClass("is-invalid");
        ageInput.addClass("is-valid");
        return 0;

    }
    function validateAddress() {
        const re = /^[0-9]+\s[a-zA-z\s]+[,]\s[a-zA-z\s]+[,][a-zA-z\s]+[,]\s[0-9]{5}$/gm
        if (!addressInput.val()) {
            addressInput.addClass("is-invalid");
            $("#address + .invalid-feedback").text("Please enter a valid Address.")
            return 1;
        }
        if (!re.test(addressInput.val())) {
            addressInput.addClass("is-invalid");
            $("#address + .invalid-feedback").text("Please enter a valid Address. Format: street, city, state, zip code(5 digits)")
            return 1;
        }
        addressInput.removeClass("is-invalid");
        addressInput.addClass("is-valid");
        return 0;

    }
    function validatePhone() {
        const re = /^[0-9]{3}[-][0-9]{3}[-][0-9]{4}$/gm
        if (!phoneInput.val()) {
            phoneInput.removeClass("is-invalid");
            phoneInput.addClass("is-valid");
            return 0;
        }
        if (!re.test(phoneInput.val())) {
            phoneInput.addClass("is-invalid");
            $("#phonenum + .invalid-feedback").text("Please enter a valid Phone Number. Format: 123-456-7890")
            return 1;
        }
        phoneInput.removeClass("is-invalid");
        phoneInput.addClass("is-valid");
        return 0;
    }
    function data() {
        return {
            "email": emailInput.val(),
            "name": fNameInput.val() + " " + lNameInput.val(),
            "age": parseInt(ageInput.val()),
            "address": addressInput.val(),
            "phone": phoneInput.val()
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
})
