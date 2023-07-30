$(document).ready(function () {
    let form = $("#userForm");
    console.log("sdf")
    let emailInput = $("#email");
    let pw = $("#passInput");
    let alertPlaceholder = $("#alertPlaceholder");


    form.on("submit", submit);
    emailInput.on("focusout", (event) => {
        validateEmail();
    })
    emailInput.on("input", (event) => {
        validateEmail();
    })
    pw.on("focusout", validatePassword);
    pw.on("input", validatePassword);

    function submit(event) {
        //validation logic here
        event.preventDefault();
        event.stopPropagation();
        if (!validateAll()) {
            appendAlert("Submission not successful, please check fields for mistakes.", "danger")
            return;
        }

        let jsonUser = {
            email: emailInput.val(),
            password: pw.val()
        }

        let json = "";
        for (key in jsonUser) {
            json += `${key} : ${jsonUser[key]} <br>`
        }
        console.log(json)
        $.ajax({
            Headers: {
                "Content-Type": "application/json"
            },
            url: "https://130.203.136.203:3004/login",
            data: JSON.stringify(jsonUser),
            dataType: "text",
            type: "POST",
            contentType: "application/json",
            crossDomain: true,
        })
            .done(function (response) {
                console.log("ajax success")
                console.log(response);
                const d = new Date();
                d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
                let expires = "expires=" + d.toUTCString();
                document.cookie = `session=${response};  ${expires}; path=/;`

            })
            .fail(function (xhr, status, errorThrown) {
                console.log("Status: " + status)
                console.log("Error: " + errorThrown)
                console.log("xhr: " + xhr)
            })
        appendAlert("Success! <br> Json Shopper Object: <br>" + json, "success")
    }

    function validateAll() {
        let valid = true;
        if (validateEmail() > 0) valid = false;
        if (validatePassword > 0) valid = false;
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
    function validatePassword() {
        let errorMesage = "";

        if (!pw.val()) {
            errorMesage = "Please enter a password.";
            addInvalid(pw, errorMesage);
            return 1;
        };

        makeValid(pw);
        return 0;
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

})