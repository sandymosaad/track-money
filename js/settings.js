$(document).ready(function (){
let userName = JSON.parse(sessionStorage.getItem('User')).userName;
// console.log(userName)

// if(!userName){window.location.href='index.html';
//     console.log('hh')
// }


let userEmail = JSON.parse(sessionStorage.getItem('User')).email;
let passHash = JSON.parse(sessionStorage.getItem('User')).newPassHash;
let monthName =new Date().toLocaleDateString('en-US', {month:'long'});

$('#userName').html(`User Name: ${userName}`);
$('#userEmail').html(`User Email: ${userEmail}`);

console.log(userName, userEmail)
$('#editData').on('click', function(){
    $('#userNameInput').val( userName)
    $('#userEmailInput').val(userEmail)
})

$('#updateData').on('click' , async function(event){
    event.preventDefault()
    let userName= $('#userNameInput').val().trim();
    let email = $('#userEmailInput').val().trim();
    let oldPass =$('#oldPass').val().trim();
    let newPass = $('#newPass').val().trim();
    let oldPassHash = await hashPassword(oldPass) ;
    // console.log(oldPass)
    // console.log(newPass)
    // console.log(oldPassHash)

    if(oldPassHash===passHash){
            let user={};
            if(newPass){
                let newPassHash= await hashPassword(newPass) ;
                user={userName,email,newPassHash}
            }else{
                user={userName,email,oldPassHash}
            }

        let users=JSON.parse(localStorage.getItem ('Users'))||[]
        users= users.filter(user=> user.userName!==userName);
        users.push(user);
        console.log(user) 
        localStorage.setItem('Users', JSON.stringify(users ))
    }else{
        $('#validationData').removeClass('d-none');
        $('#validationData').html('enter right pass pleas')
    }

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


$('#clearAllData').on('click', function(){
    if (confirm('Are You Sure You Want To Clear All Data !')=== true){
        localStorage.removeItem(`budget-${userName}`);
        localStorage.removeItem(`transactions-${userName}`);
        localStorage.removeItem(`money-${monthName}-${userName}`);
    }else{
        console.log('done')
    }

    


});

$('#logoutBtn').on('click' , function(){
    sessionStorage.clear();
    window.location.href="index.html";
    console.log('hhh')
})

})

