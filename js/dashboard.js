// welcomed user
let user = JSON.parse(sessionStorage.getItem("User"));
let userName=user.userName;
document.querySelector('.welcomedUser').textContent=`Welcome ${userName} in your dashboard`;


// income,expense,balance data
let income=1000;
let expense=300;
let balance=income-expense;

document.querySelector('.card-income .card-text').textContent="EL."+income;
document.querySelector('.card-expense .card-text').textContent="EL."+expense;
document.querySelector('.card-balance .card-text').textContent="EL."+balance;

// transactions data 
// let transactions = [
//     { date: '1/1/2023', description: 'Salary', type: 'income', amount: 1000 },
//     { date: '2/1/2023', description: 'Grocery', type: 'expense', amount: 200 },
//     { date: '3/1/2023', description: 'Salary', type: 'income', amount: 1000 },
//     { date: '4/1/2023', description: 'Grocery', type: 'expense', amount: 200 },
//     { date: '5/1/2023', description: 'Salary', type: 'income', amount: 1000 },
// ];
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






