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


    form.on("submit", submit);
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

    function submit(event) {
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

        let json = "";
        for (key in jsonUser) {
            json += `${key} : ${jsonUser[key]} <br>`
        }
        console.log(json)
        appendAlert("Success! <br> Json Shopper Object: <br>" + json, "success")



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
        var data = {
            "email": emailInput.val(),
            "name": fNameInput.val() + " " + lNameInput.val(),
            "age": ageInput.val(),
            "address": addressInput.val(),
            "phone": phoneInput.val()
        }
        return data;
    }

    function appendAlert(message, type) {
        alertPlaceholder.html(`<div class="alert alert-${type} alert-dismissible" role="alert">` +
            `   <div>${message}</div>` +
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
            '</div>')
    }

})
