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

$('#login').on('click',function(event){
    event.preventDefault()
    let Name =$('#userName').val();
    let password = $('#password').val();

    let users = JSON.parse(localStorage.getItem('Users'))
    let user =users.find( user=> user.password ==password && (user.userName ===Name || user.email ===Name ));
    if(user){
        sessionStorage.setItem('User',JSON.stringify(user))
        window.location.href='dashboard.html';
        //$('#userName').val('');
    }else{
        $('#errorMessage').removeClass('d-none')
    }
    console.log(user)
})

