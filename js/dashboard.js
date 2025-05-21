$(document).ready(function(){
    let user = JSON.parse(sessionStorage.getItem('User'));
    if(!user)window.location.href='index.html';

// welcomed user
let userName=user.userName;
document.querySelector('.welcomedUser').textContent=`Welcome ${userName} in your dashboard`;


// income,expense,balance data
let monthName = new Date().toLocaleDateString('en-US', {month:'long'});
let userMoney = JSON.parse(localStorage.getItem(`money-${monthName}-${userName}`));

//console.log(userMoney)
document.querySelector('.card-income .card-text').textContent="EL."+userMoney.totalIncome;
document.querySelector('.card-expense .card-text').textContent="EL."+userMoney.totalExpense;
document.querySelector('.card-balance .card-text').textContent="EL."+userMoney.balance;

// transactions data 
let transactions =JSON.parse(localStorage.getItem(`transactions-${userName}`)) || []
if (transactions.length>0){
    let tableBody = document.querySelector('.table tbody');
        transactions.sort((a, b) => b.id - a.id);
        let visibleData = transactions.slice(0, 5);
    visibleData.forEach((transaction) => {
        let row = tableBody.insertRow(); 
        
        row.insertCell(0).textContent = transaction.kind;
        row.insertCell(1).textContent = transaction.description;
        row.insertCell(2).textContent = 'EL.' + transaction.amount;
        row.insertCell(3).textContent = transaction.date;
        let typeCell = row.insertCell(4);
        if (transaction.type === 'income') {
            typeCell.innerHTML = `<span class="badge bg-success">Income</span>`;
        } else {
            typeCell.innerHTML = `<span class="badge bg-danger">Expense</span>`;
        }
    });
}else{
    $('#noDataInTable').removeClass('d-none')
    $('.transctionTable').addClass('d-none')

}





})
