function updateTotalValue(){
    fetch('http://localhost:5000/refresh', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          body: null
          // log that the data has been refreshed from yahoo
        }).then(function(response) {
          console.log("up to date data retrieved");})

    fetch('http://localhost:5000/products/initialvalue', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      body: null}).then(function(response){
        console.log(response);
        return response.json();})
        .then(function(json) {
            console.log(json);
            // do something with the json response?
            var initialValue = json;
        });

    fetch('http://localhost:5000/products/totalvalue', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            body: null
            // process the new total portfolio value by converting it to JSON
          }).then(function(response) {
            console.log(response);
            return response.json();})
            .then(function(json) {
                console.log(json);
                // do something with the json response?
                var value = json;
            });

    let myDiv = document.getElementById("totalValueDiv");
    myDiv.textContent = "$"+value[1];
    let myDiv2 = document.getElementById("changeInValueText1");
    myDiv2.textContent = "The initial value of the portfolio was $" + initialValue[1];
    let myDiv3 = document.getElementById("changeInValueText2");
    myDiv3.textContent = "Change in value: "+100*(value[1]-initialValue[1])/initialValue[1]+"%"
    if (value[1]>initialValue[1]){
      myDiv.addEventListener('click', function onClick(event){
        event.target.style.color = 'green';
      })
    }
    else {
      myDiv.addEventListener('click', function onClick(event){
        event.target.style.color = 'gredreen';
      })
    }
  }
// get the data from the server
fetch('http://localhost:5000/products', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: null
    // process the data by converting it to JSON
  }).then(function(response) {
    console.log(response);
    return response.json();
  }).then(function(json) {
    console.log(json);
    // display the data in the browser
    var products = json;
    var productsHtml = '';
    // loop round the list of products and create HTML for each one
    for (var i = 0; i < products.length; i++) {
      productsHtml += '<div class="product">';
      productsHtml += '<p class="holdingName">' + products[i][1] + '</p>';
      productsHtml += '<li class="dateOfPurchase">' + products[i][2] + '</li>';
      productsHtml += '<li class="priceAtPurchase">' + products[i][3] + '</li>';
      productsHtml += '<li class="currentPrice">' + products[i][4] + '</li>';
      productsHtml += '<li class="qty">' + products[i][5] + '</li>';
      productsHtml += '</div>';
      productsHtml += '</br>';
    }
    //id, holdingName, dateOfPurchase, priceAtPurchase, currentPrice, qty
    // display the HTML in the browser
    document.getElementById('products').innerHTML += productsHtml;
  });

  function loadPie(){
    var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
    var yValues = [55, 49, 44, 24, 15];
    var barColors = [
    "#b91d47",
    "#00aba9",
    "#2b5797",
    "#e8c3b9",
    "#1e7145"
    ];
    
    new Chart("myChart", {
    type: "doughnut",
    data: {
        labels: xValues,
        datasets: [{
        backgroundColor: barColors,
        data: yValues
        }]
    },
    options: {
        title: {
        display: true,
        text: "World Wide Wine Production 2018"
        }
    }
    });
};