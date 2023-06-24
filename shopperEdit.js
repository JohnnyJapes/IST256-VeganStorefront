$(document).ready(function () {
    let form = $("#userForm");
    console.log("sdf")
    let emailInput = $("#email");
    let fNameInput = $("#fName");
    let lNameInput = $("#lName");
    let ageInput = $("#age");
    let addressInput = $("#address");
    let phoneInput = $("#phonenum");


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






    function submit(event) {
        //validation logic here
        //form.addClass("was-validated")
        event.preventDefault();
        event.stopPropagation()
        validateEmail();
        validateFirstName();
        validateLastName();
        validateAge();

    }
    //fucntion for email validation
    //checks for @ sign and that the input isn't empty
    function validateEmail() {
        const re = new RegExp("[a-zA-Z0-9]+@[a-zA-Z0-9]+", "gm")
        if (!emailInput) {
            emailInput.addClass("is-invalid");
            $("#email + .invalid-feedback").text("Email Address Required.")
            return;
        }
        if (!re.test(emailInput.val())) {
            emailInput.addClass("is-invalid");
            $("#email + .invalid-feedback").text("Invalid Email Address. Please enter a valid Email address. Ex: Jack@google.com")
            return
        }
        emailInput.removeClass("is-invalid");
        emailInput.addClass("is-valid");
    }
    function validateFirstName() {
        const re = /^[a-zA-z]+$/gm
        if (!fNameInput) {
            fNameInput.addClass("is-invalid");
            $("#fName + .invalid-feedback").text("Please enter a name.")
            return;
        }
        if (!re.test(fNameInput.val())) {
            fNameInput.addClass("is-invalid");
            $("#fName + .invalid-feedback").text("Please enter a valid name. Name must not contain numbers, special characters, or spaces.")
            return;
        }
        fNameInput.removeClass("is-invalid");
        fNameInput.addClass("is-valid");
    }
    function validateLastName() {
        const re = /^[a-zA-z]+$/gm
        if (!lNameInput) {
            lNameInput.addClass("is-invalid");
            $("#lName + .invalid-feedback").text("Please enter a name.")
            return;
        }
        if (!re.test(lNameInput.val())) {
            lNameInput.addClass("is-invalid");
            $("#lName + .invalid-feedback").text("Please enter a first and last name. Name must not contain numbers or special characters.")
            return;
        }
        lNameInput.removeClass("is-invalid");
        lNameInput.addClass("is-valid");
    }
    function validateAge() {
        //console.log(parseInt(ageInput.val()))
        //console.log(ageInput.val())
        if (!parseInt(ageInput.val())) {
            ageInput.addClass("is-invalid");
            console.log("age")
            $("#age + .invalid-feedback").text("Please enter a valid age.")
            return;
        }
        if (parseInt(ageInput.val()) < 18) {
            ageInput.addClass("is-invalid");
            console.log("age error")
            $("#age + .invalid-feedback").text("Invalid age. Please enter a number above 17.")
            return;
        }
        if (parseInt(ageInput.val()) > 100) {
            ageInput.addClass("is-invalid");
            console.log("age")
            $("#age + .invalid-feedback").text("Invalid age. Please enter a number under 110.")
            return;
        }
        ageInput.removeClass("is-invalid");
        ageInput.addClass("is-valid");

    }
    function validateAddress() {

    }
    function validatePhone() { }

})

// // Example starter JavaScript for disabling form submissions if there are invalid fields
// (() => {
//     'use strict'

//     // Fetch all the forms we want to apply custom Bootstrap validation styles to
//     const forms = document.querySelectorAll('.needs-validation')

//     // Loop over them and prevent submission
//     form.on('submit', event => {
//         if (!form.checkValidity()) {
//             event.preventDefault()
//             event.stopPropagation()
//         }

//         form.classList.add('was-validated')
//     }, false)

// })()
