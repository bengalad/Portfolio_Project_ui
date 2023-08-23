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