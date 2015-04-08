"use strict";

function calculate() {
  // Look up the input and output elements in the document
  var amount = document.getElementById("amount");
  var apr = document.getElementById("apr");
  var years = document.getElementById("years");
  var zipcode = document.getElementById("zipcode");
  var payment = document.getElementById("payment");
  var total = document.getElementById("total");
  var totalinterest = document.getElementById("totalinterest");
  
  // Get the user's input from the input elements.
  // Assume all input is valid (for now).
  // Convert interest rate from percentage to decimal
  // Convert from annual rate to monthly rate
  // Convert payment period in years to number of monthly payments
  var principal = parseFloat(amount.value.replace(/,/g, ''));
  var rate = parseFloat(apr.value) / 100 / 12;
  var payments = parseFloat(years.value) * 12;
  
  // Compute the monthly payment
  var x = Math.pow(1 + rate, payments);
  var monthly = (principal * x * rate) / (x - 1);
  
  // If the result is a finite number, the user's input was good
  // and we have meaningful results to display
  if (isFinite(monthly)) {
    // Fill in the output fields, rounding to 2 decimal places
    payment.innerHTML = formatNumber(monthly);
    total.innerHTML = formatNumber(monthly * payments);
    totalinterest.innerHTML = formatNumber((monthly * payments) - principal);
    
    // Save the user's input so we can restore it
    // the next time they visit
    save(amount.value, apr.value, years.value, zipcode.value);
    
    // Advertise: find and display local lenders
    // but ignore network errors
    try { // Catch any errors that occur within these curly braces...

    }
    
    catch(e) {
      // ... And ignore these errors
    }
    
    // Finally, chart loan balance, interest, and equity payments
    chart(principal, rate, monthly, payments)
  }
  else {
    // Result was NaN or Infinite, 
    // which means the input was incomplete or invalid.
    // Clear any previously-displayed output.
    payment.innerHTML = "";
    total.innerHTML = "";
    totalinterest.innerHTML = "";
    chart();  // With no arguments, clears the chart
  }
}

// Save the user's input as properties of the localStorage object.
// Those properties will still be there
// when the user visits in the future.
// This storage feature will not work in some browsers
// (eg, Firefox) if you run the example from a local file URL
// It does work over HTTP, however.
function save(amount, apr, years, zipcode) {
  if (window.localStorage) { // Only do this if the browser supports it
    localStorage.loan_amount = amount;
    localStorage.loan_apr = apr;
    localStorage.loan_years = years;
    localStorage.loan_zipcode = zipcode;
  }
}

// Automatically attempt to restore input fields
// when the document first loads.
window.onload = function() {
  // If the browser supports localStorage
  // and we have some stored data
  if (window.localStorage && localStorage.loan_amount) {
    document.getElementById("amount").value = localStorage.loan_amount;
    document.getElementById("apr").value = localStorage.loan_apr;
    document.getElementById("years").value = localStorage.loan_years;
    document.getElementById("zipcode").value = localStorage.loan_zipcode;
  }
};

// Chart the monthly loan balance, interest, and
// equity in an HTML <canvas> element.
// If called with no arguments, then just erase
// any previously drawn chart.
function chart(principal, rate, monthly, payments) {
  var graph = document.getElementById("graph");
  graph.width = graph.width; // Magic to clear and reset the canvas element
  
  // If we're called with no arguments, 
  // or if the browser does not support graphics
  // in a <canvas> element, then just return now.
  if (arguments.length === 0 || !graph.getContext) return;
  
  // Get the "context" object for the <canvas>
  // that defines the API
  var g = graph.getContext("2d"); // All drawing is done with this object
  var width = graph.width, height = graph.height; // Get canvas size
  
  // These functions convert payment numbers
  // and dollar amounts to pixels
  function paymentToX(n) {
    return n * width/payments;
  }
  function amountToY(a) {
    return height - (a * height / (monthly * payments * 1.05));
  }
  
  // Payments are a straight line from (0,0)
  // to (payments, monthly * payments)
  g.moveTo(paymentToX(0), amountToY(0)); // Start at lower left
  g.lineTo(paymentToX(payments), // Draw to upper right
           amountToY(monthly * payments));
  g.lineTo(paymentToX(payments), amountToY(0))
}

function formatNumber (num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    // http://blog.tompawlak.org/number-currency-formatting-javascript
}