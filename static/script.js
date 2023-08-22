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
};