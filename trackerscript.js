//1
const balance = document.getElementById(
    "balance"
  );
  const money_plus = document.getElementById(
    "money-plus"
  );
  const money_minus = document.getElementById(
    "money-minus"
  );
  const list = document.getElementById("list");
  const form = document.getElementById("form");
  const text = document.getElementById("text");
  const amount = document.getElementById("amount");
  const ctx = document.getElementById('transaction-chart').getContext('2d');
  // const dummyTransactions = [
  //   { id: 1, text: "Flower", amount: -20 },
  //   { id: 2, text: "Salary", amount: 300 },
  //   { id: 3, text: "Book", amount: -10 },
  //   { id: 4, text: "Camera", amount: 150 },
  // ];
  
  // let transactions = dummyTransactions;
  
  //last 
  const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
  
  let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];
  
  let chart = new Chart(ctx, {
    type: 'bar', // You can change this to 'pie', 'line', etc.
    data: {
      labels: ['Income', 'Expense'], // X-axis labels
      datasets: [{
        label: 'Amount',
        data: [0, 0], // Initially, income and expense are 0
        backgroundColor: ['#2ecc71', '#e74c3c'], // Green for income, red for expense
        borderColor: ['#27ae60', '#c0392b'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  //Update Chart
  // Function to update the chart based on current transactions
  function updateChart() {
    const amounts = transactions.map(transaction => transaction.amount);
    const income = amounts.filter(amount => amount > 0).reduce((acc, item) => acc + item, 0);
    const expense = amounts.filter(amount => amount < 0).reduce((acc, item) => acc + item, 0) * -1;

    // Update the chart data
    chart.data.datasets[0].data = [income, expense];
    chart.update();
}


  //5
  //Add Transaction
  function addTransaction(e){
    e.preventDefault();
    if(text.value.trim() === '' || amount.value.trim() === ''){
      alert('please add text and amount')
    }else{
      const transaction = {
        id:generateID(),
        text:text.value,
        amount:+amount.value
      }
  
      transactions.push(transaction);
  
      addTransactionDOM(transaction);
      updateValues();
      updateLocalStorage();
      text.value='';
      amount.value='';
    }
  }
  
  
  //5.5
  //Generate Random ID
  function generateID(){
    return Math.floor(Math.random()*1000000000);
  }
  
  //2
  
  //Add Trasactions to DOM list
  function addTransactionDOM(transaction) {
    //GET sign
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
  
    //Add Class Based on Value
    item.classList.add(
      transaction.amount < 0 ? "minus" : "plus"
    );
    
    item.innerHTML = `
      ${transaction.text} <span>&#8377;${Math.abs(
      transaction.amount
    )}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    
    list.appendChild(item);
    
      }
  //4
  
  //Update the balance income and expence
  function updateValues() {
    const amounts = transactions.map(
      (transaction) => transaction.amount
    );
    const total = amounts
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);
    const income = amounts
      .filter((item) => item > 0)
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);
    const expense =
      (amounts
        .filter((item) => item < 0)
        .reduce((acc, item) => (acc += item), 0) *
      -1).toFixed(2);
  
      balance.innerHTML = `&#8377;${total}`;
      money_plus.innerHTML = `+&#8377;${income}`;
      money_minus.innerHTML = `-&#8377;${expense}`;

      //calling updatechart
      updateChart();
  }
  
  
  //6 
  
  //Remove Transaction by ID
  function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    Init();
  }
  //last
  //update Local Storage Transaction
  function updateLocalStorage(){
    localStorage.setItem('transactions',JSON.stringify(transactions));
  }
  
  //3
  
  //Init App
  function Init() {
    list.innerHTML = "";  // Clear the list
    transactions.forEach(addTransactionDOM);  // Render transactions
    updateValues();  // Update balance and chart
  }
  
  
  Init();
  
  form.addEventListener('submit',addTransaction);