$(document).ready(function () {
    // get user name
    let userName =JSON.parse(sessionStorage.getItem("User")).userName;
    console.log(userName)
    let transactions=JSON.parse(localStorage.getItem(`transactions-${userName}`))||[];
    let currentPage = 1
    const rowsPerPage = 5
    let chartInstance = null;
    let filterTransactions= [];

    // console.log(currentPage, rowsPerPage, totalPages)
    displayTransactionsDataInTable(transactions);
    renderPagination(transactions)
    calculateTotalIncomeForThisMonth()


$('#openModelToAddTransaction').on('click', function(){
        restForm()
        $('#kindDropdown').html(`<i class="fa-solid fa-utensils me-2 text-warning"></i> Food & Groceries`)
        $("#updateTransaction").addClass('d-none');
        $("#addTransaction").removeClass('d-none');
        $('#validationData').addClass('d-none');
})


// get data of a new transaction 
$('#kindOptions .dropdown-item').on('click' , function(event){
    event.preventDefault();
        $('#kindDropdown').html($(this).html());
    $('#selectedKind').val($(this).attr('data-value')) ;
})

$('#addTransaction').on('click',function(event){
    event.preventDefault()
    let description = $('#description').val().trim();
    let amount = Number($('#amount').val().trim());
    //let type = $('#type').val().trim();
    let type = $('#type').val();
    let date = $('#date').val().trim();
    let kind = $('#selectedKind').val().trim();

    console.log(kind,description,amount,type,date)
    validtion(kind,description,amount,date,type)
})

function validtion(kind,description,amount,date,type){
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let transactionDate = new Date(date);
    transactionDate.setHours(0, 0, 0, 0);

    if(!amount || !description || !date || !type || !kind){
        $('#validationData').removeClass('d-none');
        $('#allDataError').removeClass('d-none');
    }else{
        if((amount>0) && (transactionDate.getTime()<=today.getTime())){
            $('#validationData').addClass('d-none');
            //$('#allDataError').addClass('d-none');
            storeTransaction(kind,description,amount,type,date);
        }else{
            if(amount<=0){
                $('#validationData').removeClass('d-none');
                $('#amountError').removeClass('d-none');
            }else{
                $('#amountError').addClass('d-none');
            }
            if (transactionDate.getTime() > today.getTime()){
            $('#validationData').removeClass('d-none');
            $('#dateError').removeClass('d-none');
            }else{
                $('#dateError').addClass('d-none');
            }
        }
    }
}
function storeTransaction(kind,description, amount, type, date){
    let id;
    let transactions=JSON.parse(localStorage.getItem(`transactions-${userName}`))||[];
    if ( transactions.length > 0){
        lastId= Number(transactions[transactions.length - 1].id) ;
        id = lastId+1;
    } else{
        id=1;
    }
    let fullDate = new Date(date);
    let year = fullDate.getFullYear();
    //let month = fullDate.getMonth() + 1;
    let monthName = fullDate.toLocaleDateString('en-US', {month:'long'});
    let transaction={ id, kind, description, amount, type, date, year, monthName };

    //console.log(year ,month ,monthName  )
    console.log(transaction)
    transactions.push(transaction);
    localStorage.setItem(`transactions-${userName}`,JSON.stringify(transactions));
    restForm();
    $('#transactionModal').modal('hide');
    notfication('Transaction added successfully','success');
    displayTransactionsDataInTable(transactions);
}

function restForm(){
    $('#description').val('');
    $('#amount').val('');
    $('#type').val('');
    $('#date').val('');
}


function displayTransactionsDataInTable(transactions){
    //let transactions= JSON.parse(localStorage.getItem(`transactions-${userName}`))||[];
    //console.log(transactions);
    if (transactions.length>0){
        $("#transactionTable").removeClass('d-none')
        $('#noDataInTable').addClass('d-none')
        let start = (currentPage - 1) * rowsPerPage
        let end = start + rowsPerPage
        transactions.sort((a, b) => b.id - a.id);
        let visibleData = transactions.slice(start, end);
        let tableBody = document.querySelector('.table tbody');

        $(tableBody).empty();
        visibleData.forEach(transaction => {
            let row = tableBody.insertRow();
            row.insertCell(0).textContent=transaction.kind;
            row.insertCell(1).textContent=transaction.description;
            row.insertCell(2).textContent='EL.'+ transaction.amount;
            row.insertCell(3).textContent=transaction.date;
            //console.log(transaction.date);
            transaction.type === 'income' ? row.insertCell(4).innerHTML = `<span class="badge bg-success">Income</span>` : row.insertCell(4).innerHTML = `<span class="badge bg-danger">Expense</span>`;
            row.insertCell(5).innerHTML=`<button class="btn btn-danger btn-sm" data-id="${transaction.id}" id="deleteTransaction"><i class="fa fa-trash"></i></button>
            <button class="btn btn-warning btn-sm" data-id='${transaction.id}' id="editTransaction"><i class="fa fa-edit"></i></button>`
        });
        } else{
            $("#transactionTable").addClass('d-none')
            $("#pagination").addClass('d-none')
            $('#noDataInTable').removeClass('d-none')
            $('#noDataInTable').text('Do not have any transaction yet !');
        }
    renderPagination(transactions);
    calculateTotalIncomeForThisMonth();
}
// pagination
function totalPagesFunction(transactions){
     //let transactions= JSON.parse(localStorage.getItem(`transactions-${userName}`))||[];
    //console.log(x)
    let totalPages = Math.ceil(transactions.length / rowsPerPage)
    return totalPages
}
function renderPagination(transactions) {
      if(filterTransactions.length>0){
        totalPages = totalPagesFunction(filterTransactions);
        //console.log(filterTransactions)
    }else{
        totalPages = totalPagesFunction(transactions)
        //console.log(transactions)
    }
    //let totalPages  = totalPagesFunction(transaction);
    const paginationList = $('#pagination ul');
    paginationList.empty();
    paginationList.append(`
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#">Previous</a>
        </li>`);

    for (let i = 1; i <= totalPages; i++) {
        paginationList.append(`            
            <li class="page-item ${currentPage === i || totalPages===1 ? 'active' : ''}">
                <a class="page-link" href="#">${i}</a>
            </li>`);
    }

    paginationList.append(`
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#">Next</a>
        </li>`);
    
}


$('.pagination').on('click', '.page-link', function(event) {
    event.preventDefault();
    const clickedText = $(this).text();
    let totalPages;
    if(filterTransactions.length>0){
        totalPages = totalPagesFunction(filterTransactions);
        //console.log(filterTransactions)
    }else{
        totalPages = totalPagesFunction(transactions)
        //console.log(transactions)
    }

    if (clickedText === 'Next') {
        if (currentPage < totalPages) {
            currentPage++;
        }
    } else if (clickedText === 'Previous') {
        if (currentPage > 1) {
            currentPage--;
        }
    } else {
        currentPage = Number(clickedText);
    }
    if(filterTransactions.length>0){
        //totalPages = totalPagesFunction(filterTransactions)
        displayTransactionsDataInTable(filterTransactions);
        renderPagination(filterTransactions);
        //console.log(filterTransactions)
    }else{
        displayTransactionsDataInTable(transactions);
        renderPagination(transactions);
        //console.log(transactions)

    }
  
});

// notficaton
function notfication(message, type){
    $('#notification')
    .removeClass()
    .addClass(`alert alert-${type}`)
    .text(message)
    .hide()
    .fadeIn(300)
    .delay(2000)
    .fadeOut(500);
}

// delete transaction

// $('#deleteTransaction').on('click', function(event){
//     let id = $(this).attr('data-id')
//    // console.log(id)
//     deleteTransaction(id)
// })
/////////////////////////////////////////// i need to kwon why yhis work and this not
$(document).on('click','#deleteTransaction',function(event){
    let id = $(this).attr('data-id')
   // console.log(id)
    deleteTransaction(id)
})
function deleteTransaction(id){
    let transactions = JSON.parse(localStorage.getItem(`transactions-${userName}`))||[];
    transactions= transactions.filter(transaction=> transaction.id!= id);

    localStorage.setItem(`transactions-${userName}`,JSON.stringify(transactions));
    displayTransactionsDataInTable(transactions);
    notfication('Transaction deleted successfully!', 'danger');
    renderPagination(transactions);
}

// edit transaction
$(document).on('click','#editTransaction', function(event){
    let id = Number($(this).attr('data-id'));
    console.log(id)
    editTransaction(id);
} )

function editTransaction(id){
    $("#transactionModal").modal('show');
    $('#validationData').addClass('d-none');
    $("#updateTransaction").removeClass('d-none')
    $("#addTransaction").addClass('d-none')

    let transactions = JSON.parse(localStorage.getItem(`transactions-${userName}`));
    let transaction = transactions.find(transaction=>transaction.id == id)
    //console.log(transaction)
    $('#description').val(transaction.description);
    $('#amount').val(transaction.amount);
    $('#type').val(transaction.type);
    $('#date').val(transaction.date);
    $('#selectedKind').val(transaction.kind)

    //let selectedKind = transaction.kind;
    let dropdownlist = document.querySelectorAll('#kindOptions .dropdown-item');
    dropdownlist.forEach(item => {
        if (item.getAttribute('data-value') === transaction.kind) {
            $('#kindDropdown').html(item.innerHTML);
        }
    });
    this.id=id;
}

$('#updateTransaction').on('click', function(){
    let description = $('#description').val().trim();
    let amount = Number($('#amount').val().trim());
    let type = $('#type').val().trim();
    let date = $('#date').val().trim();
    let kind = $('#selectedKind').val().trim();
    let transaction ={id, kind, description, amount, type, date};
    let  transactions = JSON.parse(localStorage.getItem(`transactions-${userName}`));
    transactions= transactions.filter(transaction=> transaction.id != id);
    transactions.push(transaction);
    localStorage.setItem(`transactions-${userName}`,JSON.stringify(transactions));
    displayTransactionsDataInTable(transactions);
    notfication('Transaction updated successfully!','succss')
})

// card section This
function calculateTotalIncomeForThisMonth(){
    let transactions = JSON.parse(localStorage.getItem(`transactions-${userName}`))||[];
    let totalIncome= 0;
    let totalExpense= 0;
    let monthName = new Date().toLocaleDateString('en-US', {month:'long'});

    for (i=0; i<transactions.length ; i++){
        if (transactions[i].type=== 'income' && transactions[i].monthName === monthName){
            totalIncome += Number(transactions[i].amount);
        }else if(transactions[i].type=== 'expense' && transactions[i].monthName === monthName) {
            totalExpense+= Number(transactions[i].amount);
        }
    }
    let balance = totalIncome -totalExpense;
    let userMoney ={totalIncome , totalExpense ,balance}
    localStorage.setItem(`money-${monthName}-${userName}`,JSON.stringify(userMoney))
    //console.log(totalExpense, totalIncome, balance)
    $('.card-income .card-text').text('EL.'+totalIncome);
    $('.card-expense .card-text').text('EL.'+totalExpense);
    $('.card-balance .card-text').text('EL.'+balance);
    drowChart(totalIncome , totalExpense, balance)
}

// chart section
function drowChart(totalIncome,totalExpense,balance){
    if(totalIncome >0 || totalExpense>0){
        $('#balanceChartPargrph').addClass('d-none')
        $('#chart').removeClass('d-none')
        let ctx1 = document.getElementById("balanceChart").getContext("2d");
        if (chartInstance !== null) {
                chartInstance.destroy();
            }
            chartInstance =new Chart(ctx1, {
                type: "pie",
                data: {
                    labels: ['Income','Expense'],
                    datasets: [{
                        //label: `Balance is EL.${ balance}`,
                        data: [totalIncome || 0,totalExpense ||0], 
                        backgroundColor:[ '#55f091','rgb(240, 102, 102)'], 
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            });
    }else{
        $('#balanceChartPargrph').removeClass('d-none')
        $('#chart').addClass('d-none')
    }


}

// filter
$('#filterTransaction').on('click' , function(event){
    event.preventDefault();
    filterTransactions=[];
    let dayFilter = $('#dateFilterByDay').val();
    let monthFilter = $('#dateFilterByMonth').val();
    monthFilter=new Date(monthFilter).toLocaleDateString('en-US', {month:'long'});

    let transactions= JSON.parse(localStorage.getItem(`transactions-${userName}`));
    transactions.forEach( transaction=>{
        if (dayFilter === transaction.date || monthFilter === transaction.monthName){
            filterTransactions.push (transaction)
        } 
    });
    //console.log(filterTransactions);
    displayTransactionsDataInTable(filterTransactions);
    renderPagination(filterTransactions);
    $("#filterModal").modal('hide');
})
$('#clearFiltertion').on('click' , function(){
    $('#dateFilterByDay').val('');
    $('#dateFilterByMonth').val('');
    filterTransactions= [];
    displayTransactionsDataInTable(transactions);
    renderPagination(transactions);
    $("#filterModal").modal('hide');
        
})


});
