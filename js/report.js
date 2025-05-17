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
let chartInstance= null;
transactions.forEach(transaction => {
    if(monthName===transaction.monthName && year===transaction.year){
        monthTransactions.push(transaction)
    }
});

monthTransactions.forEach(transaction=>{
    if(transaction.type==='expense'){
        monthExpense+= transaction.amount;
        sepirtDataOfCategory(expenseCategory,transaction)
    }else if (transaction.type==='income'){
        monthIncome+= transaction.amount;
        sepirtDataOfCategory(incomeCategory,transaction)
    }
});

function sepirtDataOfCategory(ObjectOfIncomeOrExpense,transaction){
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

let expenseCategoryLables =[];
let expenseCategoryData = [];
let incomeCategoryLables =[];
let incomeCategoryData = [];

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

if(monthExpense>0){
    drawCategoryItemsWithProgressBar(expenseCategory,expenseCategoryLables,expenseCategoryData,monthExpense ,'categoryExpense')
}
if(monthIncome>0){
    drawCategoryItemsWithProgressBar(incomeCategory,incomeCategoryLables,incomeCategoryData,monthIncome, 'categoryIncome')
}

// --------------------------------- charts --------------------------
function generateRandomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
let backgroundColors = expenseCategoryLables.map(() => generateRandomColor());

let ctxExpense = document.getElementById("expenseChart").getContext("2d");
if (chartInstance !== null) {
        chartInstance.destroy();
    }
chartInstance =new Chart(ctxExpense, {
    type: "pie",
    data: {
        labels: expenseCategoryLables,
        datasets: [{
            //label: `Balance is EL.${ balance}`,
            data:  expenseCategoryData, 
            backgroundColor:backgroundColors, 
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
});

let ctxIncome = document.getElementById('incomeChart').getContext('2d');
new Chart( ctxIncome,{
    type: "pie",
    data:{
        labels: incomeCategoryLables,
        datasets: [{
            data: incomeCategoryData,
            backgroundColor:backgroundColors,
        }]
    },
    options:{
        responsive :true,
        maintainAspectRatio: false,

    }
})