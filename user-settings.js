const accountMenu = document.getElementById("btnAccount");
const btnCloseAccountMenu = document.getElementById("btn-close-account");
const modalBody = document.getElementById("userSettingsBody");
var buttonConfirmation = document.querySelectorAll("#yesOrNot");
var confirmationSection = document.getElementById("change-confirm")


accountMenu.addEventListener("click", async function() {
    let user = await firebase.auth().currentUser;
    
    //console.log(user);
    
    console.log("lo escucha");
    let picture = await getPicture(user.photoURL,user);
    
    if (picture == null || picture == undefined) {
       
    } else{
        
        modalAccount.querySelector("#photoURL").src=picture;
    }


 
    modalAccount.querySelector("#user").innerHTML=`${user.displayName}`
    modalAccount.querySelector("#email").innerHTML=`${user.email}` 
    modalAccount.style.display="block";
});



document.getElementById('btnDeletAcc');
btnDeletAcc.addEventListener("click", async (e) => {
    confirmationSection.style.display="block"
	console.log("borrar cuenta")
	buttonConfirmation.forEach((btnConf) =>
            btnConf.addEventListener("click", async (e) => {
                e.preventDefault();
                console.log(e.target.value);
                if (e.target.value == "true") {
                    console.log("es true");
                    
                    modalAccount.style.display="none";
                    modalLogin.dataset.value = "reAuthDeleteUser"
                    modalLogin.style.display="inline-block"
                    //await deleteAccount();
                } else if (e.target.value == "false") {
                    console.log("es false")
                    confirmationSection.style.display="none"
                } else{
                    console.log("error")
                }
            })
        )
})

btnCloseAccountMenu.addEventListener("click", async function(){
	modalAccount.style.display="none";
})

async function deleteAccount(credential,email,password){
    const user = await firebase.auth().currentUser;
    if (credential == null) {
        console.log("si entra;")
        var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
        );
        console.log(credential)
    }
    
    

    //const credential = promptForCredentials();

    user.reauthenticateWithCredential(credential).then(() => {
      // User re-authenticated.
      user.delete().then(() => {console.log("usuario borrado")}).catch((error) => {console.log("error al borrar")});
    }).catch((error) => {
      // An error ocurred
      // ...
    });

}

modalNewPassword = document.getElementById("modalNewPassword");
btnChangePass = document.getElementById("change-password");
btnChangePass.addEventListener("click", async function(e){
    e.preventDefault();
    modalNewPassword.style.display="inline-block";
    modalAccount.style.display="none";
    //modalLogin.dataset.value = "reAuthDeleteUser"
    
});

const newPassInput= document.getElementById("new-password-input");
const btnNewPass = document.getElementById("btnNewPasswordField");
btnNewPass.addEventListener("click", async function(e){
    e.preventDefault();
    modalLogin.dataset.value = "changePassword"
    modalNewPassword.style.display="none";
    modalLogin.style.display="inline-block";


    console.log(newPassInput.value)
});

async function changePassword(credential,email,password){
    let newPassword = newPassInput.value;
    const user = await firebase.auth().currentUser;
    if (credential == null) {
        console.log("si entra;")
        var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
        );
        console.log(credential)
    }
    
    

    //const credential = promptForCredentials();

    user.reauthenticateWithCredential(credential).then(() => {
      // User re-authenticated.
      user.updatePassword(newPassword).then(() => {console.log("si jalo we jaja")}).catch((error) => {console.log(error);});
    }).catch((error) => {
      // An error ocurred
      // ...
    });

}
