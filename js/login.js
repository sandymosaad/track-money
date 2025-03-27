// toggel between login and sign up
$('#signUpToggel').on('click', function(){
    $('.loginBox').addClass('d-none');
    $('.signUpBox').removeClass('d-none');
})

$('#loginToggel').on('click', function(){
    $('.loginBox').removeClass('d-none');
    $('.signUpBox').addClass('d-none');
})

$('#createAccount').on('click', function(event){
    event.preventDefault(); 

    let userName =$('#signUpUserName').val();
    let email =$('#email').val();
    let password =$('#signUpPassword').val()

    let user ={
        'userName':userName,
        'email':email,
        'password':password
    }
    
    let usersStored=JSON.parse(localStorage.getItem('Users'))|| []
    usersStored.push(user)

    localStorage.setItem('Users', JSON.stringify(usersStored))
    //console.log(user)
    $('.loginBox').removeClass('d-none');
    $('.signUpBox').addClass('d-none');
})

