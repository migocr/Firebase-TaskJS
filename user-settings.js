const accountMenu = document.getElementById("btnAccount");
const btnCloseAccountMenu = document.getElementById("btn-close-account");
const modalBody = document.getElementById("userSettingsBody");
var buttonConfirmation = document.querySelectorAll("#yesOrNot");
var confirmationSection = document.getElementById("change-confirm")

//Muestra el modal con las opciones y datos del usuario
accountMenu.addEventListener("click", async function() {
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


    
    
    var storageRef = firebase.storage().ref('profile_picture/'+user.uid);
    //const credential = promptForCredentials();

    user.reauthenticateWithCredential(credential).then(async() => {
        // Delete profile picture
        await storageRef.delete().then(function() {console.log("imagen borrada");}).catch(function(error) {console.log(error)});
        //delete user account
        await user.delete().then(() => {console.log("usuario borrado")}).catch((error) => {console.log("error al borrar")});
      
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


const btnNewEmailField = document.getElementById("btnNewEmaildField");
const modalNewEmail = document.getElementById("modal-new-email");
const btnChangeEmail = document.getElementById("change-email");
btnChangeEmail.addEventListener("click", async function(){
    console.log("te escucho");
    modalAccount.style.display="none";
    modalNewEmail.style.display="inline-block";
});

let emailInput = document.getElementById("change-email-input");
btnNewEmailField.addEventListener("click",async function(e){
    let email = emailInput.value;
    if (validateEmail(email)) {
        modalNewEmail.style.display="none";
        modalLogin.dataset.value="changeEmail"
        modalLogin.style.display="inline-block";
    } else {
       
    }
    console.log(e)
    
    
    console.log(email);
});

async function changeEmail(credential,email,password){
    let newEmail = emailInput.value;
    const user = await firebase.auth().currentUser;
    if (credential == null) {
        console.log("si entra;")
        var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
        );
        console.log(credential)
    }
    user.reauthenticateWithCredential(credential).then(() => {
      // User re-authenticated.
      user.updatePassword(newPassword).then(() => {console.log("si jalo we jaja")}).catch((error) => {console.log(error);});
    }).catch((error) => {
      // An error ocurred
      // ...
    });

    user.updateEmail(newEmail).then(() => {console.log("si le sabes")}).catch((error) => {console.log(error)});


}

const btnDeleteAllTasks = document.getElementById("delete-all-tasks");
btnDeleteAllTasks.addEventListener("click",async function(){
    console.log("si jala")
    let user = await firebase.auth().currentUser;
    let email = user.email;
    db.collection("users").doc(email).set({
        
            tasks : [
            ]
        
        


    });
});


const btnUploadImage = document.getElementById("btn-upload-image");
btnUploadImage.addEventListener("click",async function(){
    console.log("lo escucha");
});











function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}