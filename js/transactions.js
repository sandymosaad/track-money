$(document).ready(function () {
// get user name
    let userName =JSON.parse(sessionStorage.getItem("User")).userName;
    console.log(userName)

    displayTransactionsDataInTable();




// get data of a new transaction 
$('#addTransaction').on('click',function(event){
    event.preventDefault()
let descraiption = $('#description').val().trim();
let amount = $('#amount').val().trim();
let type = $('#type').val().trim();
let date = $('#date').val().trim();

console.log(descraiption,amount,type,date);

storeTransaction(descraiption,amount,type,date);
})

function storeTransaction(descraiption, amount, type, date){
    let transaction={ descraiption, amount, type, date };
    let transactions=JSON.parse(localStorage.getItem(`transactions-${userName}`))||[];
    transactions.push(transaction);
    localStorage.setItem(`transactions-${userName}`,JSON.stringify(transactions));
    restForm();
    $('#transactionModal').modal('hide');
}

function restForm(){
    $('#description').val('');
    $('#amount').val('');
    $('#type').val('');
    $('#date').val('');
}

function displayTransactionsDataInTable(){
    let transactions= JSON.parse(localStorage.getItem(`transactions-${userName}`))||[];
   let tableBody= $('#transactionsTable')[0];
   //let tableBody = document.querySelector('.table tbody');

    console.log(tableBody)
    $(tableBody).empty();
    transactions.forEach(transaction => {
        let row = tableBody.insertRow();
        row.insertCell(0).textContent=transaction.descraiption;
        row.insertCell(1).textContent=transaction.amount;
        row.insertCell(2).textContent=transaction.date;
        //console.log(transaction.date);
        transaction.type === 'income' ? row.insertCell(3).innerHTML = `<span class="badge bg-success">Income</span>` : row.insertCell(3).innerHTML = `<span class="badge bg-danger">Expense</span>`;
        row.insertCell(4).innerHTML=`<button class="btn btn-danger btn-sm" "><i class="fa fa-trash"></i></button>
        <button class="btn btn-warning btn-sm"><i class="fa fa-edit"></i></button>`
    });
}


//onclick="deleteTransaction('${transaction.descraiption}')



});