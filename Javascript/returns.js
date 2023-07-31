
//ANGULAR JS
let returnsApp = angular.module('returnsApp', []);
returnsApp.controller('returnsController', function ($scope, $controller) {
    $scope.showJSON = false
    $scope.displayJSON = function () {
        $scope.returnsJSON = {
            order: $scope.orderNum,
            descriptionription: $scope.description
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
    let description = $("#description");

    //jQuery Listeners
    form.on("submit", submit);
    order.on("input", validateOrderNumber);
    order.on("focusout", validateOrderNumber);
    description.on("input", validateDescription);
    description.on("focusout", validateDescription);


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
            addInvalid(description, "Please enter a valid descriptionription.")
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
            descriptionription: description.val()

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

