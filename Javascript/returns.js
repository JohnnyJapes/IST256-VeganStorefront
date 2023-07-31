//AJAX FUNCTIONS
function getReturnsInfo() {
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

    $.getJSON("http://130.203.136.203:3004/returns", { session: id }, function (data, status) {
        console.log(data)
        let json = "";
        for (key in data) {
            json += `${key} : ${data[key]} \n`
        }
        //console.log(data.cart)
        alert("Found Address for Account: \n " + json + "\nStatus: " + status);

    }).fail(function () {
        console.log("AJAX returns retrieval failed")
    });
}





//ANGULAR JS
let returnsApp = angular.module('returnsApp', []);
returnsApp.controller('returnsController', function ($scope, $controller) {
    getReturnsInfo()
    $scope.showJSON = false
    $scope.displayJSON = function () {
        $scope.returnsJSON = {
            order: $scope.orderNum,
            description: $scope.description
        }
        console.log('angular')
        console.log($scope.returnsJSON)
        for (key in $scope.returnsJSON) {
            if ($scope.returnsJSON[key]) $scope.showJSON = true
        };

    }
})

$(document).ready(function () {
    let form = $("#returnsForm");
    let order = $("#orderNum");
    let desc = $("#description");

    //jQuery Listeners
    form.on("submit", submit);
    order.on("input", validateOrderNumber);
    order.on("focusout", validateOrderNumber);
    desc.on("input", validateDescription);
    desc.on("focusout", validateDescription);


    function submit() {
        event.preventDefault();
        event.stopPropagation();
        console.log("submit")
        if (!formValidation()) {
            appendAlert("Some fields are invalid.", "danger");
            return
        }
        updateReturns();

    }
    // Form validation function
    function formValidation() {
        var isValid = true;

        //validate street address
        if (!validateOrderNumber()) isValid = false;

        //validate City
        if (!validateDescription()) isValid = false;



        return isValid;
    }
    //Individual Validation functions

    function validateOrderNumber() {
        if (!order.val()) {
            addInvalid(order, "Please enter a valid order.")
            return false;
        }
        else {
            makeValid(order);
            return true;
        }

    }
    function validateDescription() {
        if (!description.val()) {
            addInvalid(description, "Please enter a valid description.")
            return false;
        }
        else {
            makeValid(description);
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
    function returnsJson() {
        let returns = {
            orderNumber: order.val(),
            description: desc.val()

        }
        return returns;
    }
    function updateReturns() {
        $.ajax({
            url: "https://ist256.up.ist.psu.edu:3004/returns",
            data: JSON.stringify(returnsJson()),
            //dataType: "json",
            type: "POST",
            contentType: "application/json",
            crossDomain: true,
        })
            .done(function () {
                console.log("ajax success")
                appendAlert("Successfully Submitted", "success");
            })
            .fail(function (xhr, status, errorThrown) {
                console.log("Status: " + status)
                console.log("Error: " + errorThrown)
                console.log("xhr: " + xhr)
                appendAlert("Ajax Failure", "danger")
            })
    }
})

