$(document).ready(function () {

let userName =JSON.parse( sessionStorage.getItem('User')).userName;
let expense = JSON.parse(localStorage.getItem(`money-${userName}`)).totalExpense;
let budget = JSON.parse (localStorage.getItem(`budget-${userName}`));
displayBudgetDataAtCard();

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

}






})