$(document).ready(function () {

let userName =JSON.parse( sessionStorage.getItem('User')).userName;
let expense = JSON.parse(localStorage.getItem(`money-${userName}`)).totalExpense;
let budget = JSON.parse (localStorage.getItem(`budget-${userName}`));
displayBudgetDataAtCard();
updatedBudgetProgress(budget ,expense);

// show card if user allready had enterd budget 
if(budget){
    $('#budget-card').removeClass('d-none');
    $('#openModelToAddBudget').text('Edit Budget')
}

$('#addBudget').on('click' , function(event){
    event.preventDefault()
    let budgetInput = Number($('#budgetInput').val().trim());
    if(!budgetInput){
        $('#validationData').removeClass('d-none');
        $('#validationData').append(`<p class="text-center py-3 m-5 alert alert-warning">Please Enter Number At Budget !</p>`)
    }else{
    if(budgetInput<=0){
        $('#validationData').removeClass('d-none');
        $('#validationData').append(`<p class="text-center py-3 m-5 alert alert-warning">Please Enter Positive Number !</p>`)
    }else{
        $('#validationData').addClass('d-none');
        localStorage.setItem(`budget-${userName}`, JSON.stringify(budgetInput));
        $('#budgetModal').modal('hide')
    }}
    displayBudgetDataAtCard();
})


function displayBudgetDataAtCard(){
    $('#card-p-budget').text(`${budget}`);
    $('#card-p-expense').text(expense);
    updatedBudgetProgress(budget,expense)
}
// edit budget
$('#openModelToAddBudget').on('click', function(){
    if(budget){
        $('#updateBudget').removeClass('d-none');
        $('#addBudget').addClass('d-none');
        $('#budgetInput').val(budget);
    }else{
        $('#updateBudget').addClass('d-none');
        $('#addBudget').removeClass('d-none');
        $('#budgetInput').val(0);
    }
})

$('#updateBudget').on('click' , function(){
    budget = Number($('#budgetInput').val().trim());
    localStorage.setItem(`budget-${userName}` , JSON.stringify(budget));
    displayBudgetDataAtCard();
})

// progress bar

function updatedBudgetProgress(budget ,expense){
let percentage = (expense /budget )* 100;
if (percentage> 100) percentage =100;

$('#budgetProgress').css('width', `${percentage}%`);
$('#budgetProgress').attr( 'aria-valuenow', percentage.toFixed(0));
$('#budgetProgress').text(`${percentage.toFixed(0)}%`)
 
if (percentage <50){
    $('#budgetProgress').removeClass().addClass('progress-bar bg-success')
}else if (percentage <80 && percentage >=50 ){
    $('#budgetProgress').removeClass().addClass('progress-bar bg-warning')
}else {
    $('#budgetProgress').removeClass().addClass('progress-bar bg-danger')
}


}






})