//ANGULAR JS
let returnsApp = angular.module('returnsApp', []);
returnsApp.controller('returnsController', function ($scope, $controller) {
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
    $scope.getReturn = function () {
        $.getJSON("https://ist256.up.ist.psu.edu:3004/returns/read", { orderNum: $scope.orderNum }, function (data, status) {
            console.log(data)
            let json = "";
            for (key in data) {
                json += `${key} : ${data[key]} \n`
            }
            //console.log(data.returns)
            console.log("Found return: \n " + json + "\nStatus: " + status);
            $scope.orderNum = data.orderNum;
            $scope.description = data.description;
            $("#add").prop("disabled", true);
            $("#update").prop("disabled", false)
            $("#delete").prop("disabled", false)
            $scope.apply()


        }).fail(function () {
            console.log("AJAX product retrieval failed")
        });


    }


    $scope.updateReturn = function () {
        var query = "https://ist256.up.ist.psu.edu:3004/returns/update";
        query += "orderNum" + $scope.orderNum;
        query += "description" + $scope.description;
        $scope.request = query;
        $scope.$apply();
        $.ajax({ url: query, crossDomain: true, dataType: 'json', type: 'GET' })
            .done(function (json) {
                $scope.response = json.result;
                $scope.$apply();
            })
            .fail(function () {
                alert("Error");
            })
    }

    $scope.deleteReturn = function () {
        //needs update button for this, will work on later
        var query = "https://ist256.up.ist.psu.edu:3004/returns/delete";
        query += "orderNum" + $scope.orderNum;
        query += "description" + $scope.description;
        $scope.request = query;
        $.ajax({ url: query, crossDomain: true, dataType: 'json', type: 'GET' })
            .done(function (json) {
                $scope.response = json.result;
                $scope.$apply();
            })
            .fail(function () {
                alert("Error");
            })
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
    order.on("focusout", getReturn);
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
        createReturns();

    }

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
        appendAlert("Product Updated/Added Successfully. Product JSON: " + prodJSON, "success");
    });


    function update() {
        event.preventDefault();
        event.stopPropagation();
        console.log("update")
        if (!formValidation()) {
            appendAlert("Some fields are invalid.", "danger");
            return
        }
        updateReturn();

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
            orderNumber: orderNumber.val(),
            descriptionription: description.val()

        }
        return returns;
    }

    function createReturns() {
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
