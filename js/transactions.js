// get user name
let userName =JSON.parse(sessionStorage.getItem("User")).userName;
console.log(userName)

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

function storeTransaction(descraiption, amount, type, data){
    let transaction={ descraiption, amount, type, data };
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

