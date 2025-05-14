$(document).ready(function () {
// get user name
    let userName =JSON.parse(sessionStorage.getItem("User")).userName;
    console.log(userName)
    let currentPage = 1
    const rowsPerPage = 5
    let chartInstance = null;

    // console.log(currentPage, rowsPerPage, totalPages)
    displayTransactionsDataInTable();
    renderPagination()
    calculateTotalIncome()


$('#openModelToAddTransaction').on('click', function(){
        restForm()
        $("#updateTransaction").addClass('d-none');
        $("#addTransaction").removeClass('d-none');
        $('#validationData').addClass('d-none');
})

// get data of a new transaction 
$('#addTransaction').on('click',function(event){
    event.preventDefault()
    let description = $('#description').val().trim();
    let amount = $('#amount').val().trim();
    //let type = $('#type').val().trim();
    let type = $('#type').val();
    let date = $('#date').val().trim();
    
    console.log(description,amount,type,date)
    validtion(description,amount,type,date)
})

function validtion(description,amount,type,date){
    if(!amount || !description || !date || !type){
        $('#validationData').removeClass('d-none');
        $('#validationData').append(`<p class="text-center py-3 m-5 alert alert-warning">Please Enter Data In All Fileds!</p>`)
    }else{
        if(amount<=0){
            $('#validationData').removeClass('d-none');
            $('#validationData').append(`<p class="text-center py-3 m-5 alert alert-warning">Please Enter Positive Number At Amount!</p>`)
        }else{
        storeTransaction(description,amount,type,date);
        }
    }
}
function storeTransaction(description, amount, type, date){
    let id;
    let transactions=JSON.parse(localStorage.getItem(`transactions-${userName}`))||[];
    if ( transactions.length > 0){
        lastId= Number(transactions[transactions.length - 1].id) ;
        id = lastId+1;
    } else{
        id=1;
    }
    let transaction={ id,description, amount, type, date };
    console.log(transaction)
    transactions.push(transaction);
    localStorage.setItem(`transactions-${userName}`,JSON.stringify(transactions));
    restForm();
    $('#transactionModal').modal('hide');
    notfication('Transaction added successfully','success');
    displayTransactionsDataInTable();
}

function restForm(){
    $('#description').val('');
    $('#amount').val('');
    $('#type').val('');
    $('#date').val('');
}


function displayTransactionsDataInTable(){
    let transactions= JSON.parse(localStorage.getItem(`transactions-${userName}`))||[];
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
            row.insertCell(0).textContent=transaction.description;
            row.insertCell(1).textContent='EL.'+ transaction.amount;
            row.insertCell(2).textContent=transaction.date;
            //console.log(transaction.date);
            transaction.type === 'income' ? row.insertCell(3).innerHTML = `<span class="badge bg-success">Income</span>` : row.insertCell(3).innerHTML = `<span class="badge bg-danger">Expense</span>`;
            row.insertCell(4).innerHTML=`<button class="btn btn-danger btn-sm" data-id="${transaction.id}" id="deleteTransaction"><i class="fa fa-trash"></i></button>
            <button class="btn btn-warning btn-sm" data-id='${transaction.id}' id="editTransaction"><i class="fa fa-edit"></i></button>`
        });
        } else{
            $("#transactionTable").addClass('d-none')
            $("#pagination").addClass('d-none')
            $('#noDataInTable').removeClass('d-none')
            $('#noDataInTable').text('Do not have any transaction yet !');
        }
    renderPagination();
    calculateTotalIncome();
}
// pagination
function renderPagination() {
    let transactions= JSON.parse(localStorage.getItem(`transactions-${userName}`))||[];

    let totalPages = Math.ceil(transactions.length / rowsPerPage)
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

    displayTransactionsDataInTable();
    renderPagination();
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
    displayTransactionsDataInTable();
    notfication('Transaction deleted successfully!', 'danger')
    renderPagination()
}

// edit transaction
$(document).on('click','#editTransaction', function(event){
    let id = Number($(this).attr('data-id'));
    console.log(id)
    editTransaction(id);
} )

function editTransaction(id){
    $("#transactionModal").modal('show');
    $("#updateTransaction").removeClass('d-none')
    $("#addTransaction").addClass('d-none')

    let transactions = JSON.parse(localStorage.getItem(`transactions-${userName}`));
    let transaction = transactions.find(transaction=>transaction.id == id)
    //console.log(transaction)
    $('#description').val(transaction.description);
    $('#amount').val(transaction.amount);
    $('#type').val(transaction.type);
    $('#date').val(transaction.date);
    this.id=id;
}

$('#updateTransaction').on('click', function(){

    let description = $('#description').val().trim();
    let amount = $('#amount').val().trim();
    let type = $('#type').val().trim();
    let date = $('#date').val().trim();
    let transaction ={id, description, amount, type, date};
    let  transactions = JSON.parse(localStorage.getItem(`transactions-${userName}`));
    transactions= transactions.filter(transaction=> transaction.id != id);
    transactions.push(transaction);
    localStorage.setItem(`transactions-${userName}`,JSON.stringify(transactions));
    displayTransactionsDataInTable();
    notfication('Transaction updated successfully!','succss')
})

// card section
function calculateTotalIncome(){
    let transactions = JSON.parse(localStorage.getItem(`transactions-${userName}`))||[];
    let totalIncome= 0;
    let totalExpense= 0;
    for (i=0; i<transactions.length ; i++){
        if (transactions[i].type=== 'income'){
            totalIncome += Number(transactions[i].amount);
        }else {
            totalExpense+= Number(transactions[i].amount);
        }
    }
    let balance = totalIncome -totalExpense;
    let userMoney ={totalIncome , totalExpense ,balance}
    localStorage.setItem(`${userName}-money`,JSON.stringify(userMoney))
    //console.log(totalExpense, totalIncome, balance)
    $('.card-income .card-text').text('EL.'+totalIncome);
    $('.card-expense .card-text').text('EL.'+totalExpense);
    $('.card-balance .card-text').text('EL.'+balance);

    drowChart(totalIncome , totalExpense, balance)
}
// cart section
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



});