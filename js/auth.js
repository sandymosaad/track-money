// toggel between login and sign up
$('#signUpToggel').on('click', function(){
    $('.loginBox').addClass('d-none');
    $('.signUpBox').removeClass('d-none');
})

$('#loginToggel').on('click', function(){
    $('.loginBox').removeClass('d-none');
    $('.signUpBox').addClass('d-none');
})

async function hashPassword(pass) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pass);
    //console.log('data' + data)
    const hash = await crypto.subtle.digest('SHA-256',data);
    //console.log( hash)
    let hashpass= Array.from(new Uint8Array(hash))
    .map(byte => byte.toString(16).padStart(2,'0'))
    .join('');
    //console.log(hashpass)
    return hashpass
}
$('#createAccount').on('click', async function(event){
    event.preventDefault(); 

    let userName =$('#signUpUserName').val().trim();
    let email =$('#email').val().trim();
    let password =$('#signUpPassword').val().trim();

    $('.text-danger').addClass('d-none');
    if(!userName || !email || !password){
        $('#fillAllFields').removeClass('d-none')
        return
    } 

    if(!validtion(userName, email, password)){
        return
    }
    
    let usersStored=JSON.parse(localStorage.getItem('Users'))|| []
    
    if (usersStored.some(existingUser  => existingUser .email === email)) {
        $('#errorMessageEmailExisted').removeClass('d-none')
        return;
    }

    let hashPass =await hashPassword(password);
    // console .log(hashPass)
    usersStored.push({ userName, email, hashPass });

    localStorage.setItem('Users', JSON.stringify(usersStored))
    $('.loginBox').removeClass('d-none');
    $('.signUpBox').addClass('d-none');
})

function validtion(name, email, pass){

let namePattern =/^[a-zA-Z /-]{3,}$/;
let emailPattern =/^([a-zA-Z0-9._-]+)@(gmail|email|yahoo)\.com$/;
let passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9@!#_-]{8,}$/;
hasError=false;
if(!namePattern.test(name)){
    $('#errorMessageName').removeClass('d-none');
    hasError=true;
}
if(!emailPattern.test(email)){
    $('#errorMessageEmail').removeClass('d-none');
    hasError=true;
}
if(!passPattern.test(pass)){
    $('#errorMessagePass').removeClass('d-none');
    hasError=true;
}
return !hasError; 

}

$('#login').on('click',async function(event){
    event.preventDefault()
    let Name =$('#userName').val().trim();
    let password = $('#password').val().trim();

    let hashedPassword = await hashPassword(password);
    //console.log(hashedPassword)

    let users = JSON.parse(localStorage.getItem('Users'))
    let user =users.find( user=> user.newPassHash ==hashedPassword && (user.userName ===Name || user.email ===Name ));
    if(user){
        sessionStorage.setItem('User',JSON.stringify(user))
        window.location.href='dashboard.html';
        //$('#userName').val('');
    }else{
        $('#errorMessage').removeClass('d-none')
    }
    console.log(user)
})


$('#togglePasswordLogin' ).on('click', function(){
    let input =$('#password');
    let icon = $(this).find('i');
    togglePassword(input,icon)
});
$('#togglePasswordSignUp' ).on('click', function(){
    let input =$('#signUpPassword');
    let icon = $(this).find('i');
    togglePassword(input,icon)
})

function togglePassword(input,icon){
    if(input.attr('type') === 'password'){
        input.attr('type','text')
        icon.removeClass('fa-eye').addClass('fa-eye-slash');
        }else{
        input.attr('type','password')
        icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
}