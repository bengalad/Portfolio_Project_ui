function refreshData(){
fetch('http://localhost:5000/refresh/stocks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          body: null
          // log that the data has been refreshed from yahoo
        }).then(function(response) {
          console.log("up to date stocks data retrieved");})

    fetch('http://localhost:5000/refresh/cash', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            body: null
            // log that the data has been refreshed from yahoo
          }).then(function(response) {
            console.log("up to date cash data retrieved");})

    fetch('http://localhost:5000/refresh/bonds', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              },
              body: null
              // log that the data has been refreshed from yahoo
            }).then(function(response) {
              console.log("up to date bond data retrieved");})
  }
              
function updateTotalValue(){
  let value = "";
  let initialValue = "";

    fetch('http://localhost:5000/products/initialvalue', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      body: null}).then(function(response){
        console.log(response);
        return response.json();})
        .then(function(json) {
            console.log(json);
            // do something with the json response?
            initialValue += json[0][0];
            console.log("initial value variable is: "+initialValue)
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
                value += json[0][0];
                console.log("total value variable is: "+value);

    let myDiv2 = document.getElementById("changeInValueText1");
    myDiv2.textContent = "The amount invested is $" + parseFloat(initialValue).toFixed(2);
    let myDiv3 = document.getElementById("changeInValueText2");
    myDiv3.textContent = "Change in value: "+(100*(value-initialValue)/initialValue).toFixed(2)+"%"
    const myDiv = document.getElementById("bigValue");
    myDiv.textContent = "$"+parseFloat(value).toFixed(2);
    if(value>initialValue){
      myDiv.style.color = 'green';
    }
    else{
      myDiv.style.color = 'red';
    }

            });


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

  async function loadPie(){

    //using promises
    let request1 = await fetch('http://localhost:5000/products/totalstocks').then(response => response.json());
    let request2 = await fetch('http://localhost:5000/products/totalbonds').then(response => response.json());
    let request3 = await fetch('http://localhost:5000/products/totalcash').then(response => response.json());

    Promise.all([request1, request2, request3])
      .then(([data1, data2, data3]) => {
        console.log(data1, data2, data3);
        
        let xValues = ["Stocks", "Bonds","Cash"];
        let yValues = [data1[0], data2[0], data3[0]];
        // let yValues = [55, 49, 44];
        let barColors = [
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
            text: "Portfolio Breakdown"
            }
        }
        });

      })
      .catch(error => {
        console.error(error);
      });
};