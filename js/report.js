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
// let monthName;
// let year;
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
// let chartInstanceExpense = null;
let chartInstance = null;
let chartInstanceExpense = { chart: null };
let chartInstanceIncome = { chart: null };



let ctxExpense = document.getElementById("expenseChart").getContext("2d");
let ctxIncome = document.getElementById('incomeChart').getContext('2d');
getTransactionsMonth(monthName, year)
function toggleInputs() {
    const reportType = document.getElementById('reportType').value;
    const yearInput = document.getElementById('yearInput');
    const monthInput = document.getElementById('monthInput');

    $('#selection' ).removeClass().addClass('col-md-4');
    $('#btnSubmit' ).removeClass().addClass('col-md-4');
    yearInput.classList.add('d-none');
    monthInput.classList.add('d-none');

    if (reportType === 'year') {
        yearInput.classList.remove('d-none');
    } else if (reportType === 'month') {
        monthInput.classList.remove('d-none');
    }

}
// function formatYear() {
//     const dateInput = document.getElementById('year');
//     const dateValue = dateInput.value;
//     // const yearOnly = new Date(dateValue).getFullYear();
//     //alert('Selected Year: ' + dateValue);
// }
$('#btnSubmit').on('click', function(event){
    event.preventDefault()
    const yearInput = $('#year').val();
    const monthInput = ($('#month').val());
    
    let fullDate = new Date(monthInput);
    year = fullDate.getFullYear();
    let monthNameInput = fullDate.toLocaleDateString('en-US', {month:'long'});
    console.log(yearInput, monthInput)
    monthName =monthNameInput;
    ///year = yearInput
        console.log( monthName)
        if (monthInput){
            getTransactionsMonth(monthName, year)
        }
        if(yearInput){
            getTransactionsMonth(0,yearInput)
        }
})
console.log( monthName)



// get month transactions and month income and expense and object of categorys
function getTransactionsMonth(monthNameArr,yearArr){
monthTransactions=[];
console.log(monthNameArr, yearArr)
if (monthNameArr){
    transactions.forEach(transaction => {
        if(monthNameArr===transaction.monthName && yearArr===transaction.year){
            monthTransactions.push(transaction)
        }
    });
    console.log( monthTransactions)
} else if(monthNameArr===0){
    console.log( transactions)
    transactions.forEach(transaction => {
        if( yearArr==transaction.year){
            monthTransactions.push(transaction)
        }
    });
    console.log( monthTransactions)

}

console.log(monthTransactions)
getTotalIncomeAndExpense()
}

function getTotalIncomeAndExpense(){
    monthExpense=0;
    monthIncome=0;
    expenseCategory={};
    incomeCategory={};
    monthTransactions.forEach(transaction=>{
        if(transaction.type==='expense'){
            monthExpense+= transaction.amount;
            getObjectOfCategoryDepandOnTypeOfTransaction(expenseCategory,transaction)
        }else if (transaction.type==='income'){
            monthIncome+= transaction.amount;
            getObjectOfCategoryDepandOnTypeOfTransaction(incomeCategory,transaction)
        }
    });
console.log(monthExpense, monthIncome)
}


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
    drowChartAndCategory()
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

function drawChart(chartKey,chartId,labels,data){
    let backgroundColors = expenseCategoryLables.map(() => generateRandomColor());
    
   if (chartKey.chart !== null) {
        chartKey.chart.destroy();
    }

    chartKey.chart  = new Chart( chartId,{
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

function drowChartAndCategory(){

        // Clear previous categories and data
    $('#categoryExpense').empty();
    $('#categoryIncome').empty();
    expenseCategoryLables = [];
    expenseCategoryData = [];
    incomeCategoryLables = [];
    incomeCategoryData = [];

    if(monthExpense>0){
        drawCategoryItemsWithProgressBar(expenseCategory,expenseCategoryLables,expenseCategoryData,monthExpense ,'categoryExpense');
        drawChart(chartInstanceExpense, ctxExpense,expenseCategoryLables,expenseCategoryData);
    }
    if(monthIncome>0){
        drawCategoryItemsWithProgressBar(incomeCategory,incomeCategoryLables,incomeCategoryData,monthIncome, 'categoryIncome');
        drawChart(chartInstanceIncome,ctxIncome,incomeCategoryLables,incomeCategoryData);
    }
        //drawStatisticsChart();
    displayDataInTable();
}


//-------------------------


// table
function displayDataInTable(){
    const transactionsByDate = {};
    let year = monthTransactions[0].year
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
    $(tbody).empty()
    let row = tbody.insertRow();
    row.insertCell(0).textContent= (monthName==='Invalid Date')? year: monthName;
    row.insertCell(1).textContent= - monthExpense;
    row.insertCell(2).textContent= `+ ${monthIncome}`;
    row.insertCell(3).textContent= monthIncome -monthExpense;


    transactionsLOOP.forEach(transaction=>{
    let row = tbody.insertRow();
    row.insertCell(0).textContent= transaction.tranDate;
    row.insertCell(1).textContent= - transaction.totalTransactionExpense;
    row.insertCell(2).textContent= (transaction.totalTransactionIncome>0)? `+ ${transaction.totalTransactionIncome}` :transaction.totalTransactionIncome ;
    row.insertCell(3).textContent= (transaction.balanseTransaction>0)? `+ ${transaction.balanseTransaction}`:transaction.balanseTransaction;
    })
    console.log(transactionsLOOP)
    drawStatisticsChart(transactionsLOOP);
}


// chart for statistics
function drawStatisticsChart(transactionsLOOP){
    const labels = transactionsLOOP.map(t => t.tranDate);
const incomeData = transactionsLOOP.map(t => t.totalTransactionIncome);
const expenseData = transactionsLOOP.map(t => t.totalTransactionExpense);

const ctxBlanace = document.getElementById('dailyChart').getContext('2d');
if(chartInstance !== null){
chartInstance.destroy();
}
chartInstance=new Chart(ctxBlanace, {
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
}




