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
localStorage.setItem('Categorys', JSON.stringify(categorys))
let userName = JSON.parse(sessionStorage.getItem('User')).userName;
let monthName = new Date().toLocaleDateString('en-US', {month:'long'});
let year = new Date().getFullYear();
let transactions = JSON.parse(localStorage.getItem(`transactions-${userName}`));
let monthTransactions=[];
let monthExpense =0;
let expenseCategory={};
transactions.forEach(transaction => {
    if(monthName===transaction.monthName && year===transaction.year){
        monthTransactions.push(transaction)
    }
});

monthTransactions.forEach(transaction=>{
    if(transaction.type==='expense'){
        monthExpense+= transaction.amount;

        let categoryObj = categorys.find(cat => cat.kind === transaction.kind);
        if (categoryObj){
            let catCategory = categoryObj.category;

            if(expenseCategory[catCategory]){
                expenseCategory[catCategory]+=transaction.amount
            }else{
                expenseCategory[catCategory]= transaction.amount
            }
        }
       console.log(expenseCategory)
    };
});


Object.keys(expenseCategory).forEach(key=>{
    let itemIcon;
    let itemPercentage =expenseCategory[key] /monthExpense *100 ;
    categorys.forEach(ObjCategory=>{
        if(ObjCategory.category===key){
        itemIcon = ObjCategory.icon
        }
    })
    $('#categoryExpense').append(
        ` <div id="categoryItem" class='d-flex align-items-center mt-3'>
            <i class="me-2 text-warning ${itemIcon} "></i><li>${[key]} = LE.${expenseCategory[key]}</li>
        </div>
         <div class="progress">
            <div id="itemProgress" class="progress-bar progress-bar bg-warning" role="progressbar" style="width: ${itemPercentage.toFixed(0)}%;"  aria-valuenow="${itemPercentage.toFixed(0)}%" aria-valuemin="0" aria-valuemax="100">
            ${itemPercentage.toFixed(0)}%
            </div>
        </div>
`
    )

})

// console.log (monthTransactions)
// console.log (transactions)
// console.log (monthExpense)