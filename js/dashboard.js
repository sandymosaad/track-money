// welcomed user
let user = JSON.parse(sessionStorage.getItem("User"));
let userName=user.userName;
document.querySelector('.welcomedUser').textContent=`Welcome ${userName} in your dashboard`;


// income,expense,balance data

let userMoney = JSON.parse(localStorage.getItem(`money-${userName}`));

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
        row.insertCell(0).textContent = transaction.date;
        row.insertCell(1).textContent = transaction.description;
        
        let typeCell = row.insertCell(2);
        if (transaction.type === 'income') {
            typeCell.innerHTML = `<span class="badge bg-success">Income</span>`;
        } else {
            typeCell.innerHTML = `<span class="badge bg-danger">Expense</span>`;
        }
        row.insertCell(3).textContent = 'EL.' + transaction.amount;
    });
}else{
    $('#noDataInTable').removeClass('d-none')
    $('.transctionTable').addClass('d-none')

}






