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
let transactions = [
    { date: '1/1/2023', description: 'Salary', type: 'income', amount: 1000 },
    { date: '2/1/2023', description: 'Grocery', type: 'expense', amount: 200 },
    { date: '3/1/2023', description: 'Salary', type: 'income', amount: 1000 },
    { date: '4/1/2023', description: 'Grocery', type: 'expense', amount: 200 },
    { date: '5/1/2023', description: 'Salary', type: 'income', amount: 1000 },
];

let tableBody = $('.table tbody tr');
transactions.forEach((transaction, index) => {
    let row = tableBody.eq(index);
    row.find('td:nth-child(1)').text(transaction.date);
    row.find('td:nth-child(2)').text(transaction.description);
    row.find('td:nth-child(3)').text(transaction.type);
    if (transaction.type === 'income') {
        row.find('td:nth-child(3)').html(`<span class="badge bg-success">Income</span>`);

    } else {
        row.find('td:nth-child(3)').html(`<span class="badge bg-danger">Expense</span>`);
    }
    row.find('td:nth-child(4)').text('EL.' + transaction.amount);
})






