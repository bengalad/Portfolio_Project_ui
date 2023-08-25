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
    var productsHtml = `<table id="table">
                            <tr class="tableTitles">
                              <th>Holding Name</th>
                              <th>Date of Purchase</th>
                              <th>Price at Purchase</th>
                              <th>Current Price</th>
                              <th>Profit</th>
                              <th>Quantity</th>
                              </tr>`;
    // loop round the list of products and create HTML for each one
    for (var i = 0; i < products.length; i++) {
      let profit = (products[i][4] - products[i][3]).toFixed(2);
      productsHtml += '<tr class="tableRow">';
      productsHtml += '<td>' + products[i][1] + '</td>';
      productsHtml += '<td>' + products[i][2].replace("00:00:00 GMT","") + '</td>';
      productsHtml += '<td>' + products[i][3] + '</td>';
      productsHtml += '<td>' + products[i][4] + '</td>';
      productsHtml += '<td>' + profit + '</td>'
      productsHtml += '<td>' + products[i][5] + '</td>';
      productsHtml += `<td id ="deleteButton"><input type="button" value="Delete" onclick="deleteRow(this)"></td>`
      productsHtml += '</tr>';
    }
    productsHtml += '</table>';
    
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

function deleteRow(r) {
  console.log("button clicked!");
  let i = r.parentNode.parentNode.rowIndex;
  console.log(i);
  
  // print the text in the Holding Name table column to the console
  let table = document.getElementById("table");
  let holdingName = table.rows[i].cells[0].innerHTML;
  console.log(holdingName);

  // delete the row from the table
  table.deleteRow(i);
  
  // deleting from database
    fetch('http://localhost:5000/products/stocks/'+holdingName, {method: 'DELETE'})
    .then(function(response) {
      console.log(response);
      return response.json();
    }).then(function(json) {
      console.log(json);
    });

    fetch('http://localhost:5000/products/cash/'+holdingName, {method: 'DELETE'})
    .then(function(response) {
      console.log(response);
      return response.json();
    }).then(function(json) {
      console.log(json);
    });


    fetch('http://localhost:5000/products/bonds/'+holdingName, {method: 'DELETE'})
    .then(function(response) {
      console.log(response);
      return response.json();
    }).then(function(json) {
      console.log(json);
    });
}

function sendCash() {
  // set up some variables containing the values of the inputs in the form
  let holdingName = document.getElementById("holdingName").value;
  let ticker = document.getElementById("ticker").value;
  let qty = document.getElementById("qty").value;
  qty = parseFloat(qty);
  let dateOfPurchase = new Date();
  dateOfPurchase = dateOfPurchase.toISOString().split('T')[0];
  let exchAtPurchase = document.getElementById("exchAtPurchase").value;
  exchAtPurchase = parseFloat(exchAtPurchase);
  let exchCurrent = exchAtPurchase;
  let currentValue = qty*exchCurrent;

  // put all the variables into a JavaScript object
  let cash = {
      "holdingName": holdingName,
      "dateOfPurchase": dateOfPurchase,
      "exchAtPurchase": exchAtPurchase,
      "exchCurrent": exchCurrent,
      "qty": qty,
      "currentValue": currentValue,
      "ticker": ticker
  };
  // convert the JavaScript object into a JSON string
  let cashJson = JSON.stringify(cash);
  console.log(cashJson);
  document.getElementById("cashForm").reset();
  // send the JSON string to the server
  fetch('http://localhost:5000/cash', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: cashJson
  }).then(function(response) {
      console.log(response);
      return response.json();
  })
  .catch(function(error) {
      console.log(error);
  })
  .then(function(json) {
      console.log(json);
  })
  .catch(function(error) {
      console.log(error);
  });
  return false;
}

function sendStocks() {
  // set up some variables containing the values of the inputs in the form
  let holdingName = document.getElementById("holdingName2").value;
  let ticker = document.getElementById("ticker2").value;
  console.log(ticker);
  let qty = document.getElementById("qty2").value;
  qty = parseFloat(qty);
  console.log(qty);
  let dateOfPurchase = new Date();
  dateOfPurchase = dateOfPurchase.toISOString().split('T')[0];
  let currentPrice = document.getElementById("currentPrice2").value;
  currentPrice = parseFloat(currentPrice);
  let priceAtPurchase = currentPrice;

  let stock = {
      "holdingName": holdingName,
      "dateOfPurchase": dateOfPurchase,
      "priceAtPurchase": priceAtPurchase,
      "qty": qty,
      "currentPrice": currentPrice,
      "ticker": ticker
  };
  // convert the JavaScript object into a JSON string
  let stockJson = JSON.stringify(stock);
  console.log(stockJson);
  document.getElementById("stockForm").reset();
  // send the JSON string to the server
  fetch('http://localhost:5000/stocks', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: stockJson
  }).then(function(response) {
      console.log(response);
      return response.json();
  })
  .catch(function(error) {
      console.log(error);
  })
  .then(function(json) {
      console.log(json);
  })
  .catch(function(error) {
      console.log(error);
  });
  return false;
}

function sendBonds() {
  // set up some variables containing the values of the inputs in the form
  let holdingName = document.getElementById("holdingName3").value;
  let priceAtPurchase = document.getElementById("priceAtPurchase3").value;
  priceAtPurchase = parseFloat(priceAtPurchase);
  let qty = document.getElementById("qty3").value;
  qty = parseFloat(qty);
  let dateOfPurchase = new Date();
  dateOfPurchase = dateOfPurchase.toISOString().split('T')[0];
  let currentPrice = priceAtPurchase;
  let parValue = document.getElementById("parValue").value;
  parValue = parseFloat(parValue);
  let maturityDate = document.getElementById("maturityDate").value;
  let coupon = document.getElementById("coupon").value;
  coupon = parseFloat(coupon);
  let discountRate= document.getElementById("discountRate");
  discountRate = parseFloat(discountRate);

  let bond = {
      "holdingName": holdingName,
      "dateOfPurchase": dateOfPurchase,
      "priceAtPurchase": priceAtPurchase,
      "qty": qty,
      "currentPrice": currentPrice,
      "parValue": parValue,
      "maturityDate": maturityDate,
      "coupon": coupon,
      "discountRate": discountRate
  };
  // convert the JavaScript object into a JSON string
  let bondJson = JSON.stringify(bond);
  console.log(bondJson);
  document.getElementById("bondForm").reset();
  // send the JSON string to the server
  fetch('http://localhost:5000/bonds', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: bondJson
  }).then(function(response) {
      console.log(response);
      return response.json();
  })
  .catch(function(error) {
      console.log(error);
  })
  .then(function(json) {
      console.log(json);
  })
  .catch(function(error) {
      console.log(error);
  });
  return false;
}

function popUpCash() {
  let text = "Are you sure you want to add this cash? \n ";
  if (confirm(text) == true) {
    text = "Cash added!";
  } else {
    text = "Addition cancelled!";
  }
  document.getElementById("confirmationTextCash").innerHTML = text;
}

function popUpStock() {
  let text = "Are you sure you want to add this stock? \n ";
  if (confirm(text) == true) {
    text = "Stock added!";
  } else {
    text = "Addition cancelled!";
  }
  document.getElementById("confirmationTextStock").innerHTML = text;
}

function popUpBond() {
  let text = "Are you sure you want to add this bond? \n ";
  if (confirm(text) == true) {
    text = "Bond added!";
  } else {
    text = "Addition cancelled!";
  }
  document.getElementById("confirmationTextBond").innerHTML = text;
}