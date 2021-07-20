const accountMenu = document.getElementById("btnAccount");
const btnCloseAccountMenu = document.getElementById("btn-close-account");
const modalBody = document.getElementById("userSettingsBody");
var buttonConfirmation = document.querySelectorAll("#yesOrNot");
var confirmationSection = document.getElementById("change-confirm")


accountMenu.addEventListener("click", async function() {
    let user = await firebase.auth().currentUser;
    
    console.log(user);
    
    console.log("lo escucha");
    modalAccount.querySelector("#photoURL").src=user.photoURL;
    modalAccount.querySelector("#user").innerHTML=`${user.displayName}`
    modalAccount.querySelector("#email").innerHTML=`${user.email}` 
    modalAccount.style.display="block";
});

const user = firebase.auth().currentUser;
console.log("user settings");
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
                    await deleteAccount();
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

async function deleteAccount(){
    const user = await firebase.auth().currentUser;

    user.delete().then(() => {
      console.log("usuario borrado");
    }).catch((error) => {
        console.log(error);
      // An error ocurred
      // ...
    });
}

