$(document).ready(function () {
// get user name
    let userName =JSON.parse(sessionStorage.getItem("User")).userName;
    console.log(userName)
    let currentPage = 1
    let rowsPerPage = 5
    let transactions= JSON.parse(localStorage.getItem(`transactions-${userName}`))||[];
    let totalPages = Math.ceil(transactions.length / rowsPerPage)
    displayTransactionsDataInTable();




// get data of a new transaction 
$('#addTransaction').on('click',function(event){
    event.preventDefault()
let descraiption = $('#description').val().trim();
let amount = $('#amount').val().trim();
let type = $('#type').val().trim();
let date = $('#date').val().trim();

console.log(descraiption,amount,type,date);

storeTransaction(descraiption,amount,type,date);
})

function storeTransaction(descraiption, amount, type, date){
    let id;
    let transactions=JSON.parse(localStorage.getItem(`transactions-${userName}`))||[];
    //let lastId= transactions.length > 0 ? transactions[transactions.length - 1].id : 0;
    if ( transactions.length > 0){
        lastId= transactions[transactions.length - 1].id ;
        id = lastId+1;
    } else{
        id=1;
    }
    let transaction={ id,descraiption, amount, type, date };
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

        let visibleData = transactions.slice(start, end);
        //let tableBody= $('#transactionsTable')[0];
        let tableBody = document.querySelector('.table tbody');

        //console.log(tableBody)
        $(tableBody).empty();
        visibleData.forEach(transaction => {
            let row = tableBody.insertRow();
            row.insertCell(0).textContent=transaction.descraiption;
            row.insertCell(1).textContent=transaction.amount;
            row.insertCell(2).textContent=transaction.date;
            //console.log(transaction.date);
            transaction.type === 'income' ? row.insertCell(3).innerHTML = `<span class="badge bg-success">Income</span>` : row.insertCell(3).innerHTML = `<span class="badge bg-danger">Expense</span>`;
            row.insertCell(4).innerHTML=`<button class="btn btn-danger btn-sm" data-id="${transaction.id}" id="deleteTransaction"><i class="fa fa-trash"></i></button>
            <button class="btn btn-warning btn-sm" data-id='${transaction.id}'><i class="fa fa-edit"></i></button>`
        });
        renderPagination()
    } else{
        $('#noDataInTable').text('Do not have any transaction yet !');
    }
    
}

function renderPagination() {
    const paginationList = $('#pagination ul');
    paginationList.empty();

    paginationList.append(`
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#">Previous</a>
        </li>`);

    for (let i = 1; i <= totalPages; i++) {
        paginationList.append(`
            <li class="page-item ${currentPage === i ? 'active' : ''}">
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
}


});