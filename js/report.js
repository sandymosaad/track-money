let categorys =[
                    { kind:"food",icon:"fa-solid fa-utensils" , category: "Food & Groceries"},
                    { kind:"rent",icon:"fa-solid fa-home" , category: "Rent & Housing"},
                    {kind:"transportation",icon:"fa-solid fa-car" ,category: "Transportation"},
                    {kind:"communication",icon:"fa-solid fa-phone" ,category: "Communication"},
                    {kind:"entertainment",icon:"fa-solid fa-film" ,category: "Entertainment"},
                    {kind:"gifts",icon:"fa-solid fa-gift" ,category: "Gifts"},
                    {kind:"debts",icon:"fa-solid fa-file-invoice-dollar ",category: "Debts & Loans"},
                    {kind:"health",icon:"fa-solid fa-notes-medical" ,category: "Health"},
                    {kind:"clothing",icon:"fa-solid fa-shirt ",category: "Clothing"},
                    {kind:"education",icon:"fa-solid fa-book ",category: "Education"},
                    {kind:"shopping",icon:"fa-solid fa-shopping-bag ",category: "General Shopping"},
                    {kind:"work",icon:"fa-solid fa-briefcase ",category: "Work & Projects"},
                    {kind:"pets",icon:"fa-solid fa-paw ",category: "Pets"},
                    {kind:"travel",icon:"fa-solid fa-plane" ,category:" Travel"},
                    {kind:"personal",icon:"fa-solid fa-spa" ,category:" Personal Care"},
                    {kind:"savings",icon:"fa-solid fa-piggy-bank" ,category: "Savings"}
]
localStorage.setItem('Categorys', JSON.stringify(categorys));

let userName = JSON.parse(sessionStorage.getItem('User')).userName;
let monthName = new Date().toLocaleDateString('en-US', {month:'long'});
let year = new Date().getFullYear();
let transactions = JSON.parse(localStorage.getItem(`transactions-${userName}`));
let monthTransactions=[];

let monthExpense =0;
let monthIncome =0;

let incomeCategory={};
let expenseCategory={};

let expenseCategoryLables =[];
let expenseCategoryData = [];
let incomeCategoryLables =[];
let incomeCategoryData = [];

// get month transactions and month income and expense and object of categorys
transactions.forEach(transaction => {
    if(monthName===transaction.monthName && year===transaction.year){
        monthTransactions.push(transaction)
    }
});
monthTransactions.forEach(transaction=>{
    if(transaction.type==='expense'){
        monthExpense+= transaction.amount;
        getObjectOfCategoryDepandOnTypeOfTransaction(expenseCategory,transaction)
    }else if (transaction.type==='income'){
        monthIncome+= transaction.amount;
        getObjectOfCategoryDepandOnTypeOfTransaction(incomeCategory,transaction)
    }
});

// 
function getObjectOfCategoryDepandOnTypeOfTransaction(ObjectOfIncomeOrExpense,transaction){
    let categoryObj = categorys.find(cat => cat.kind === transaction.kind);
        if (categoryObj){
            let catCategory = categoryObj.category;
            if(ObjectOfIncomeOrExpense[catCategory]){
                ObjectOfIncomeOrExpense[catCategory]+=transaction.amount
            }else{
                ObjectOfIncomeOrExpense[catCategory]= transaction.amount
            }
        }
        console.log(ObjectOfIncomeOrExpense)
}

function drawCategoryItemsWithProgressBar(ObjectOfIncomeOrExpense, chartCategoryLables,chartCategoryData,monthExpenseOrIncome,categoryId){
    Object.keys(ObjectOfIncomeOrExpense).forEach(key=>{
        chartCategoryLables.push(key);
        chartCategoryData.push(ObjectOfIncomeOrExpense[key])
        let itemIcon;
        let itemPercentage =ObjectOfIncomeOrExpense[key] /monthExpenseOrIncome *100 ;
        categorys.forEach(ObjCategory=>{
            if(ObjCategory.category===key){
            itemIcon = ObjCategory.icon
            }
        })
        $(`#${categoryId}`).append(
            `<div id="categoryItem" class='d-flex align-items-center mt-3'>
                <i class="me-2 text-warning ${itemIcon} "></i><li>${[key]} = LE.${ObjectOfIncomeOrExpense[key]}</li>
            </div>
            <div class="progress mb-3">
                <div id="itemProgress" class="progress-bar progress-bar bg-warning" role="progressbar" style="width: ${itemPercentage.toFixed(0)}%;"  aria-valuenow="${itemPercentage.toFixed(0)}%" aria-valuemin="0" aria-valuemax="100">
                ${itemPercentage.toFixed(0)}%
                </div>
            </div>
    `
        )
    })
}


// --------------------------------- charts --------------------------

function generateRandomColor() {
    const red = 255; 
    const green = Math.floor(150 + Math.random() * 55);
    const blue = Math.floor(Math.random() * 200); 
    return `rgb(${red}, ${green}, ${blue})`;
}


let ctxExpense = document.getElementById("expenseChart").getContext("2d");
let ctxIncome = document.getElementById('incomeChart').getContext('2d');

function drawChart(chartId,labels,data){
    let backgroundColors = expenseCategoryLables.map(() => generateRandomColor());
    new Chart( chartId,{
        type: "pie",
        data:{
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor:backgroundColors,
            }]
        },
        options:{
            responsive :true,
            maintainAspectRatio: false,

        }
    })
}

if(monthExpense>0){
    drawCategoryItemsWithProgressBar(expenseCategory,expenseCategoryLables,expenseCategoryData,monthExpense ,'categoryExpense');
    drawChart(ctxExpense,expenseCategoryLables,expenseCategoryData);
}
if(monthIncome>0){
    drawCategoryItemsWithProgressBar(incomeCategory,incomeCategoryLables,incomeCategoryData,monthIncome, 'categoryIncome');
    drawChart(ctxIncome,incomeCategoryLables,incomeCategoryData);
}

//-------------------------


// table
const transactionsByDate = {};
monthTransactions.forEach(transaction => {
    const { date, amount, type } = transaction;

    if (!transactionsByDate[date]) {
        transactionsByDate[date] = { totalTransactionIncome: 0, totalTransactionExpense: 0 };
    }

    if (type === 'income') {
        transactionsByDate[date].totalTransactionIncome += amount;
    } else {
        transactionsByDate[date].totalTransactionExpense += amount;
    }
});
console.log(transactionsByDate)

const transactionsLOOP = Object.entries(transactionsByDate).map(([tranDate, { totalTransactionIncome, totalTransactionExpense }]) => {
    const balanseTransaction = totalTransactionIncome - totalTransactionExpense;
    return { tranDate, totalTransactionExpense, totalTransactionIncome, balanseTransaction };
});

console.log(transactionsLOOP);
let tbody = document.getElementById('tbody');
let row = tbody.insertRow();
row.insertCell(0).textContent= monthName;
row.insertCell(1).textContent= - monthExpense;
row.insertCell(2).textContent= `+ ${monthIncome}`;
row.insertCell(3).textContent= monthIncome -monthExpense;


transactionsLOOP.forEach(transaction=>{
let row = tbody.insertRow();
row.insertCell(0).textContent= transaction.tranDate;
row.insertCell(1).textContent= - transaction.totalTransactionExpense;
row.insertCell(2).textContent= (transaction.totalTransactionIncome>0)? `+ ${transaction.totalTransactionIncome}` :transaction.totalTransactionIncome ;
row.insertCell(3).textContent= transaction.balanseTransaction;
})

// chart for statistics
const labels = transactionsLOOP.map(t => t.tranDate);
const incomeData = transactionsLOOP.map(t => t.totalTransactionIncome);
const expenseData = transactionsLOOP.map(t => t.totalTransactionExpense);

const ctxBlanace = document.getElementById('dailyChart').getContext('2d');

new Chart(ctxBlanace, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                backgroundColor: 'rgba(25, 135, 84, 1)',
                //borderColor: 'rgba(25, 135, 84, 1)',
                borderWidth: 1
            },
            {
                label: 'Expense',
                data: expenseData,
                backgroundColor: 'rgba(220, 53, 69, 1)',
                // borderColor: 'rgba(220, 53, 69, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Daily Income vs Expense'
            }
        }
    }
});
