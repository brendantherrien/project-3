$(document).ready(() => {
    
    /******* T-Shirt Colors *******/
    // Updates the colors available for choosing when user changes their design choice
    const updateColors = () => {
        
        // Get the correct color options
        let colors = [];
        if ($("#design").val() === "select_theme")
            colors = ["please"];
        else if ($("#design").val() === "js puns")
            colors = ["cornflowerblue", "darkslategrey", "gold"];
        else
            colors = ["tomato", "steelblue", "dimgrey"];
        
        // Hide all incorrect options, show correct ones
        $("#color option").each((i, el) => {
            if (colors.indexOf($(el).val()) < 0)
                $(el).hide();
            else
                $(el).show();
        });
        
        // Update selected option if current color is no longer available
        if (colors.indexOf($("#color").val()) < 0) {
            $("#color").val(colors[0]);
        }
        
    };
    updateColors();
    
    
    /******* Activities *******/
    // Updates the activities list: Blocks out activities with competing timeslots, calculates total cost
    const updateActivities = () => {
        
        // Count total
        let total = 0;
        // Enable all
        $(".activities input").each((index, element) => {
            $(element).attr("disabled", false).removeClass("disabled");
        });
        // Loop through all checkboxes
        $(".activities input").each((index, element) => {
            // Is this checkbox checked?
            if ($(element).prop("checked")) {
                // Get attributes
                let overlap = $(element).attr("overlap");
                let cost = $(element).attr("overlap");
                // Block out overlapping events
                $(".activities input[overlap='" + overlap + "']").not(element).attr("disabled", true).parent().addClass("disabled");
                // Add to total
                total += parseInt($(element).attr("cost"));
            }
        });
        // Show total
        if (total) {
            // If there is no total yet, make one
            if (!$("#total").length)
                $(".activities").append("<h3 id='total'>Total: $" + total + "</h3>");
            else
                $("#total").text('Total: $' + total);
        } else {
            // Remove the total
            $("#total").remove();
        }
    };
    
    /******* Form Validation *******/
    // Checks for validation errors (name, email, etc.)
    const validate = () => {
        
        // Hold error messages
        let errors = [];
        
        // Check name field
        if (!$("#name").val()) {
            errors.push("Please provide your name.");
        }
        // Check email address format
        const email = $("#mail").val();
        // @ symbol must appear somewhere, AND its index must be less than the index of '.'.
        if (email.indexOf("@") < 0 || email.indexOf("@") > email.indexOf(".")) {
            errors.push("Please enter a valid email address.");
        }
        // Check for an activity
        if (!$(".activities input:checked").length) {
            errors.push("Please sign up for at least one activity.");
        }
        // Check payment validation
        if ($("#payment").val() === "credit card") {
            let ccNum = $("#cc-num").val();
            let zip = $("#zip").val();
            let cvv = $("#cvv").val();
            // Credit card
            if (!$.isNumeric(ccNum)) {
                errors.push("Please enter a valid credit card number.");
            } else if (ccNum.length < 13 || ccNum.length > 16) {
                errors.push("Credit card number must be between 13 and 16 digits.");
            }
            // Zip code
            if (!$.isNumeric(zip) || zip.length !== 5) {
                errors.push("Please enter a valid zip code.");
            }
            // CVV
            if (!$.isNumeric(cvv) || cvv.length !== 3) {
                errors.push("Please enter a valid CVV.");
            }
        } else if ($("#payment").val() === "select_method") {
            errors.push("Please select a payment method.");
        }
        
        // Are there errors? Print them at the top
        if (errors.length) {
            let message = "<h4>Please correct the following errors:<br><br>";
            $(errors).each((index, element) => {
                message += element + "<br>";
            });
            if ($("#errors").length) {
                $("#errors").html(message);
            } else {
                $("form").prepend("<div id='errors'>" + message + "</div>");
            }
            // Jump to errors
            location.href = "#top";
        } else {
            // Refresh page
            location.reload();
        }
        
    };
    
    
    // When activity is checked
    $(".activities").on("change", "input", updateActivities);
    
    // Focus on first text field
    $("input")[0].focus();
    
    // Hide Other field
    $("#other-title").hide();
    
    // Show other field if other option selected
    $("#title").on("change", (e) => {
        if ($(e.target).val() === "other")
            $("#other-title").show();
        else
            $("#other-title").hide();
    });
    
    // Only show correct color options on change of design choice OR on page load
    $("#design").on("change", updateColors);
    
    // Select credit card payment by default
    $("#payment").val("credit card");
    // Hide other divs
    $("#credit-card").siblings("div").hide();
    
    // Show payment info based on choice
    $("#payment").on("change", (e) => {
        let choice = $(e.target).val();
        if (choice === "credit card") {
            $("#credit-card").show();
            $("#paypal, #bitcoin").hide();
        } else if (choice === "paypal") {
            $("#paypal").show();
            $("#credit-card, #bitcoin").hide();
        } else if (choice === "bitcoin") {
            $("#bitcoin").show();
            $("#credit-card, #paypal").hide();
        } else {
            $("#credit-card, #bitcoin, #paypal").hide();
        }
    });
    
    // When form submitted, run validaiton check
    $("form").on("submit", (e) => {
        // Prevent form from submitting
        e.preventDefault();
        // Run validation
        validate();
    });

    
});