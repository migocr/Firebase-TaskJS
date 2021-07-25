var db = firebase.firestore();




const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("page-content");
const tasksContainerPending = document.getElementById("tasks-container-pending");
const tasksContainerComplete = document.getElementById("tasks-container-complete");
const tasksContainerExpired = document.getElementById("tasks-container-expired");
const tasksContainerWithoutDate = document.getElementById("tasks-container-without-date");
const taskFormEdit = document.getElementById("task-form-edit");
const visitorPage = document.getElementById("visitor");
const modalAccount = document.getElementById("modal-account");
const btnNewTask = document.getElementById("btnNewTask");
const addNewTask = document.getElementById("modal-addNewTask");
btnNewTask.addEventListener("click", async (e) => {
    addNewTask.style.display = "block";
});




//añade el cero si no existe en las variables de tiempo (hora, minuto, segundo)
const addZero = (i) => {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
};



//console.log(newDefaultDate);
/*
async function addDate() {
    const defaultDate = document.getElementById('date-end');
    var dateNow = new Date();
    var newDefaultDate = new Date().toLocaleDateString('pt-br').split('/').reverse().join('-') + "T" + addZero(dateNow.getHours()) + ":" + addZero(dateNow.getMinutes());
    defaultDate.value = await newDefaultDate;
    return newDefaultDate;
}*/




let editStatus = false;
let id = '';


const loginMenu = document.getElementById("login");
const registerMenu=document.getElementById("register");
const logoutMenu=document.getElementById("data-user");




const loginCheck = (user) => {
    if (user) {
        logoutMenu.style.visibility = "visible";
        registerMenu.style.display = "none";
        loginMenu.style.display = "none";
        tasksContainer.style.display = "inline-block";
        btnNewTask.style.display = "flex";
        visitorPage.style.display = "none";
        //console.log(user.email);
        //allTasksMenu.style.display = "flex";

    } else {
        logoutMenu.style.visibility = "hidden";
        registerMenu.style.display = "flex";
        loginMenu.style.display = "block";
        //accordionExample.style.display="none";
        btnNewTask.style.display = "none";
        tasksContainer.style.display = "none";
        visitorPage.style.display = "block";
        //allTasksMenu.style.display = "none";

    }
};

/**
 * Save a New Task in Firestore
 * @param {string} title the title of the Task
 * @param {string} description the description of the Task
 */

 const allTasksMenu = document.getElementById("allTasksMenu");
 allTasksMenu.addEventListener("click", async function() {
    let user = await firebase.auth().currentUser;
    let email = user.email;
    setupPosts(true,email);

});


 const dateMenuSection = document.querySelectorAll("#date-menu");
    dateMenuSection.forEach((dateMenu) =>
      dateMenu.addEventListener("click", async (e) => {
        e.preventDefault();
        let filter = e.target.className;
        let user = await firebase.auth().currentUser;
        let email = user.email;
        //console.log(filtro)
        setupPosts(true,email,filter);
    })
);







async function saveTask(email, title, description, dateEnd){
    await db.collection("users").doc(email).update({


        tasks: firebase.firestore.FieldValue.arrayUnion({
            title: title,
            description: description,
            status: false,
            date: new Date(),
            date_end: dateEnd

        })
        
    })
    setupPosts(true,email);
}


//var tareasDelUsuario = [];
async function deleteTask(id, email, tareasDelUsuario) {
    console.log(id)
    //todas las tareas
    let tasks = tareasDelUsuario;
    //tarea a borrar
    let task = tasks[id];
    var docRef = db.collection("users").doc(email);
    await docRef.update({
        //remueve la terea[i] seleccionada
        tasks: firebase.firestore.FieldValue.arrayRemove(task)
    })
    setupPosts(true,email);

};


//filtro por tareas completadas o no completadas


//const filterMenu = document.getElementById("filter-menu");

//const filterButtonText = filterMenu.querySelectorAll(".dropdown-toggle");


/*let menuSelected = [];
const filterOptions = filterMenu.querySelectorAll(".dropdown-item");
    filterOptions.forEach((filterdata) =>
      filterdata.addEventListener("click", async (e) => {
        let filtro = e.target.id;
        let menuPosition = e.target.getAttribute("data-menu");
        //console.log(e.target.text);
        console.log();
        menuSelected.push(menuPosition);
        auth.onAuthStateChanged((user) => {
        
        
        if (user) {
          console.log(user.email)
          setupPosts(true,user.email)
          filterButtonText[parseInt(menuPosition)].innerHTML=`${e.target.text}`;
        } else {
          console.log("error de inicio de sesion")
          }
        });
      }));



   */







const printTask = async (taskTitle, taskDescription, i, checked, task_at_time_color, task_at_time, section, borderCard,endDate) => {

    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    console.log(endDate);
    if (endDate == null) {
        var day = "NA";
        var month ="NA";
        var stringDay = "NA";
        var time = "NA"
    } else {
        var stringDay = weekday[endDate.getDay()];
        var month = endDate.toLocaleString('default', { month: 'short' }).toUpperCase(0);
        var day = endDate.getDate();
        var time = endDate.toLocaleTimeString();

    }
    


    section.innerHTML += `<div data-id="${i}" class="card card-body border-left" style="${borderCard}">
            <div class="col-2 text-right">
                <h1 class="display-4"><span class="badge badge-secondary">${day}</span></h1>
                <h2>${month}</h2>
            </div>
            

            <div id="postCheck"  class="round">
              <input type="checkbox" class="checkbox-circle" id="checkbox" name="${taskTitle}" ${checked}>
              <label for="${taskTitle}" data-id="${i}" value ="${i}">
              </label>
            </div>
            
            
            <div id="post" data-id="${i}">
            <h3 style="display:inline-block; padding-left:2em;" data-id="${i}" class="h5">${taskTitle}</h3>
            <ul class="list-inline">
                    <li class="list-inline-item"><i class="bx bxs-calendar-star" aria-hidden="true"></i> ${stringDay}</li>
                    <li class="list-inline-item"><i class="bx bx-alarm" aria-hidden="true"></i> ${time}</li>
                    
            </ul>

            </div>
            
              

              
              
              
              <div data-id="${i}" id="oculto">
                <p>${taskDescription}</p>
                <button class="btn btn-primary btn-delete" data-id="${i}">
                  🗑 Delete
                </button>
                <button class="btn btn-secondary btn-edit" data-id="${i}">
                  🖉 Edit
                </button>
                
                <div class="alert ${task_at_time_color}" role="alert">
                  ${task_at_time} 
                </div>
               </div>
              </div>`;
};



async function setTasks(data,email,section,filter){
    tasksContainerPending.innerHTML = "";
    tasksContainerComplete.innerHTML = "";
    tasksContainerExpired.innerHTML = "";

    var tareas = data;
    //console.log(data)
    console.log(tareas);
    tareas.sort(function(a, b) {
    
    let adiffTime = new Date(a.date_end) - new Date();
    let bdiffTime = new Date(b.date_end) - new Date();
    if (adiffTime > 0) {
        adiffTime = adiffTime * (-1)
        }
    if (bdiffTime > 0) {
    bdiffTime = bdiffTime * (-1)
        }
        //console.log("new " + new Date(b.date_end))
        //console.log(a.title + " " + diffTime)
        return (new Date(adiffTime) - new Date(bdiffTime))
    })
    console.log(tareas);

    let pendingTaskCount = 0;
    let completeTaskCount = 0;
    let expiredTaskCount = 0;
    let withoutDateTasksCount = 0;

    for (var i = tareas.length - 1; i >= 0; i--) {
        let newDate = new Date();
        let endDate = new Date(tareas[i].date_end);
        var fechaInicio = new Date(newDate).getTime();
        var fechaFin = new Date(endDate).getTime();
        var diff = fechaFin - fechaInicio;
        var diffDias = diff / (1000 * 60 * 60 * 24);
        var diffHoras = (diff % (1000 * 60 * 60 * 24) / 3.6e+6);
        var diffMinutos = (diff % (1000 * 60 * 60 * 24) % 3.6e+6) / 60000;


        
        if (newDate > endDate) {
            var task_at_time = ("Tarea caduco hace: " + Math.trunc(diffDias) * -1 + " Dias " + Math.trunc(diffHoras) * -1 + " Horas " + Math.trunc(diffMinutos) * -1 + " Minutos");
            var task_at_time_color = "alert-dark"
        } else if (new Date() == new Date(tareas[i].date_end)) {
                            //console.log("son iguales")
        } else {
            var task_at_time = ("Tiempo restante: " + Math.trunc(diffDias) + " Dias " + Math.trunc(diffHoras) + " Horas " + Math.trunc(diffMinutos) + " Minutos");
            var task_at_time_color = "alert-success"
        }
        if (tareas[i].status) {
            var checked = "checked";
            var task_at_time_color = "alert-primary"
            //console.log("es true")
        } else {
            var checked = "";
        }


        let taskTitle = tareas[i].title;
        if (taskTitle) {
            taskTitle = taskTitle[0].toUpperCase() + taskTitle.slice(1);
            }
        if (section == "buscar") {
            //imprime solo busqueda
        } else{
            //imprime todo
        }
        let taskDescription = tareas[i].description;
        var checkStatus = async() =>{
            if (endDate >= newDate && !tareas[i].status) {
                pendingTaskCount++;
                                //console.log(pendingTaskCount)
                let borderCard = "border-color: #52c28a!important";
                printTask(taskTitle, taskDescription, i, checked, task_at_time_color, task_at_time, tasksContainerPending, borderCard,endDate);
            } else if (tareas[i].status) {
                completeTaskCount++
                let borderCard = "border-color: #527ac2!important";
                printTask(taskTitle, taskDescription, i, checked, task_at_time_color, task_at_time, tasksContainerComplete, borderCard,endDate);

            } else if (newDate > endDate) {   
                expiredTaskCount++
                let borderCard = "border-color: #62656b!important";
                printTask(taskTitle, taskDescription, i, checked, task_at_time_color, task_at_time, tasksContainerExpired, borderCard,endDate);
            } else if (endDate == "Invalid Date" || endDate == undefined) {
                withoutDateTasksCount++
                let endDate = null;
                let borderCard = "border-color: #62656b!important";
                printTask(taskTitle, taskDescription, i, checked, task_at_time_color, task_at_time, tasksContainerWithoutDate, borderCard,endDate);
            }
        }
        var checkWeekOfYear = async (date) => {
            var oneJan = new Date(date.getFullYear(),0,1);
            var numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
            var result = Math.ceil(( date.getDay() + 1 + numberOfDays) / 7);
            return result;
        }


        if (filter == undefined) {
            checkStatus();

        } else if(filter){
            switch (filter) {
              case "bx bx-calendar-edit":
                if (endDate.getFullYear() == newDate.getFullYear() && endDate.getMonth() == newDate.getMonth() && endDate.getDate() == newDate.getDate()) {
                  console.log("Si hay tareas para hoy")
                  checkStatus();
                }
                break;
              case "bx bx-calendar-week":
                let endDateWeek = await checkWeekOfYear(endDate);
                let thisWeek =  await checkWeekOfYear(newDate);
                console.log(endDateWeek);
                console.log(thisWeek);

                if (thisWeek == endDateWeek)  {
                  console.log(endDate.getDate())
                  checkStatus();
                }
                break;
              case "bx bx-calendar":
                if (endDate.getFullYear() == newDate.getFullYear() && endDate.getMonth() == newDate.getMonth())  {
                  //console.log(newDate.getDate())
                  checkStatus();
                }
                break;
              case "custom":
                break;
              default:
                text = "No value found";
            }
        }

                        //console.log(taskTitle)
        
        
    }
    
    document.getElementById("taskCompleteCount").innerHTML=`${completeTaskCount} Tasks Complete`;
    document.getElementById("taskExpiredCount").innerHTML=`${expiredTaskCount} Tasks Expired`;
    document.getElementById("taskPendingCount").innerHTML=`${pendingTaskCount} Tasks Pending`;
    //document.getElementById("tasks-container-without-date").innerHTML=`${withoutDateTasksCount} Tasks no date`;

    const postCard = document.querySelectorAll("#post");
        postCard.forEach((pCard) =>
            pCard.addEventListener("click", (e) => {

                var oculto = document.querySelectorAll("#oculto");
                //console.log(e.target.dataset.id)
                var id = e.target.dataset.id;
                for (var i = oculto.length - 1; i >= 0; i--) {
                    //console.log(oculto[i].dataset.id)
                    if (oculto[i].dataset.id == e.target.dataset.id) {
                        //console.log(oculto[i].clientHeight)
                        oculto[i].style.height = "200px";
                        if (oculto[i].clientHeight == 0) {
                            oculto[i].style.height = "200px";
                            //oculto[i].style="display: inline-block; height:auto; animation: 3s fadeIn; animation-fill-mode: forwards;";
                        } else {
                            oculto[i].style.height = "0px";
                            //oculto[i].style="display:none; animation:.5s fadeIn; animation-fill-mode: forwards;";
                        }

                    }
                }


                try {



                } catch (error) {
                    console.log(error);
                }
            })
        );

const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
        btnsDelete.forEach((btn) =>
            btn.addEventListener("click", async (e) => {
                //console.log(tareasDelUsuario);
                try {
                   console.log(e.target.dataset.id, email, tareas);


                    deleteTask(e.target.dataset.id, email, tareas);
                } catch (error) {
                    //console.log(error);
                }
            })
        );



const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
        btnsEdit.forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                try {
                    document.getElementById("buttonUpdate").value = e.target.dataset.id;
                    //console.log(users.tasks[e.target.dataset.id]);
                    taskFormEdit["task-title"].value = tareas[e.target.dataset.id].title;
                    taskFormEdit["task-description"].value = tareas[e.target.dataset.id].description;
                    modalEditTask.style.display = "block";

                } catch (error) {
                    console.log(error);
                }

            });

        });



        

        


        //escucha el switch de status y lo cambia si se le da click
        const btnStatus = document.querySelectorAll(".checkbox-circle");
        const postCheck = document.querySelectorAll("div#postCheck");
        //console.log("btn status" + btnStatus.length);

        postCheck.forEach((btnStat) =>
            btnStat.addEventListener("click", async(e) => {
                
                console.log(e.target.dataset.id)
                var id = (e.target.dataset.id);
                //console.log(tareasDelUsuario[e.target])
                try {
                   
                    let taskStatus = tareas[id].status;
                    let taskTitle = tareas[id].title;
                    let taskDescription = tareas[id].description;
                    let taskDate = tareas[id].date;
                    let taskDateEnd = tareas[id].date_end;
                    tareas[id] = {
                        title: taskTitle,
                        description: taskDescription,
                        status: !taskStatus,
                        date: taskDate,
                        date_end: taskDateEnd
                    };


                    //console.log(e.target.dataset.id)
                    //console.log({title: taskTitle, description: taskDescription,status:taskStatus});



                    await db.collection("users").doc(email).update({
                        tasks: tareas
                    })
                    setupPosts(true,email);
                    



                } catch (error) {
                    console.log(error);
                }
                
            })
        );



    //update data
        const buttonUpdateTask = document.querySelectorAll("#buttonUpdate");
        buttonUpdateTask.forEach((btnUpdateTask) => {
        btnUpdateTask.addEventListener("click", async (e) => {
            //e.preventDefault();
            let id = e.target.value;
            let editedTitle = taskFormEdit["task-title"].value;
            let editedDescription = taskFormEdit["task-description"].value;
            let user = firebase.auth().currentUser;
            let email = user.email;

            let taskStatus = tareas[id].status;
            let taskTitle = tareas[id].title;
            let taskDescription = tareas[id].description;
            let taskDate = tareas[id].date;
            let taskDateEnd = tareas[id].date_end;

            tareas[id] = {
                title: editedTitle,
                description: editedDescription,
                status: taskStatus,
                date: taskDate,
                date_end: taskDateEnd
            }

           
            modalEditTask.style.display = "none";
            await db.collection("users").doc(email).update({
                        tasks: tareas
                    });
    
                    
            setupPosts(true,email);


        })
    });
           
}


//add note/post
        taskForm.addEventListener("submit", async (e) => {
        addNewTask.style.display = "none";
        e.preventDefault();
        let user = firebase.auth().currentUser;
        let email = user.email;
        
        var title = taskForm["task-title"];
        var description = taskForm["task-description"];
        var date = taskForm["date-end"];

        try {
            await saveTask(email, title.value, description.value, date.value);
            //await setupPosts(true, email);
            taskForm.reset();

            title.focus();
        } catch (error) {
            console.log(error);
        }
        //addDate();
        
    });


        





//config.js 
getUserTasks = async (email) => {
    var db = firebase.firestore();
    var docRef = db.collection("users").doc(email);
    try {
        var doc = await docRef.get()
        if (doc.exists) {
            //console.log(doc.data()); //see below for doc object
            return doc.data();
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.log("Error getting document:", error);
    };
};



async function setupPosts(e, email,filter){
    console.log(filter)

    var userData = await getUserTasks(email);
    //console.log(userData);
    
    if (userData) {
        setTasks(userData.tasks,email,null,filter);
        
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");

        }
    
    
    
    
      
                        /*
            let filterButt1 = filterButtonText[0].textContent;
            let filterButt2 = filterButtonText[1].textContent;
            
            const filterByTask = async(taskTitle,taskDescription,i,checked,task_at_time_color,task_at_time) => {
              switch (filterButt1){
                    case "All tasks":
                      printTask(taskTitle,taskDescription,i,checked,task_at_time_color,task_at_time);
                      break;
                    case "All":
                      printTask(taskTitle,taskDescription,i,checked,task_at_time_color,task_at_time);
                      break;
                    case "Completed":
                      if (tareas[i].status) {
                        printTask(taskTitle,taskDescription,i,checked,task_at_time_color,task_at_time);
                      }
                      break;
                    case "Pending":
                      if (!(tareas[i].status)) {
                        printTask(taskTitle,taskDescription,i,checked,task_at_time_color,task_at_time);
                      }
                      break;
                    case "Expired":
                      if (newDate > endDate && !(tareas[i].status)) {
                        printTask(taskTitle,taskDescription,i,checked,task_at_time_color,task_at_time);
                      }
                      break;
                    default:
                      console.log("error switch case revisar codigo");
                  }
            }


            switch (filterButt2) {
              case "By Date":
                filterByTask(taskTitle,taskDescription,i,checked,task_at_time_color,task_at_time);
                break;
              case "All":
                filterByTask(taskTitle,taskDescription,i,checked,task_at_time_color,task_at_time);
                break;
              case "Today":
                if (endDate.getFullYear() == newDate.getFullYear() && endDate.getMonth() == newDate.getMonth() && endDate.getDate() == newDate.getDate()) {
                  console.log("Si hay tareas para hoy")
                  filterByTask(taskTitle,taskDescription,i,checked,task_at_time_color,task_at_time);
                }
                break;
              case "This Week":
                var limit7day = new Date(newDate.setDate(newDate.getDate()+ parseInt(7)));
          
                if (new Date(endDate) <= new Date(limit7day) && new Date(endDate)>= new Date() || endDate.getDate() == newDate.getDate())  {
                  console.log(endDate.getDate())
                  filterByTask(taskTitle,taskDescription,i,checked,task_at_time_color,task_at_time);
                }
                break;
              case "This Month":
                if (endDate.getFullYear() == newDate.getFullYear() && endDate.getMonth() == newDate.getMonth())  {
                  //console.log(newDate.getDate())
                  filterByTask(taskTitle,taskDescription,i,checked,task_at_time_color,task_at_time);
                }
                break;
              case "Custom":
                break;
              default:
                text = "No value found";
            }
            */






};






const register = document.getElementById('register');

const modal = document.getElementById('modal');
const modalLogin = document.getElementById('modalLogin');
const modalEditTask = document.getElementById('modal-edit-task');
const btnClose = document.getElementById('btn-close');
const btnCloseLogin = document.getElementById('btn-close-login');
const btnCloseEditTask = document.getElementById('btn-close-et');
const btnCloseAddNewTask = document.getElementById('btn-close-add');

register.addEventListener("click", function() {
    modal.style.display = "block";

})

btnClose.addEventListener("click", function() {
    modal.style.display = "none";
})
btnCloseLogin.addEventListener("click", function() {
    modalLogin.style.display = "none";
})
btnCloseEditTask.addEventListener("click", function() {
    modalEditTask.style.display = "none";
})
btnCloseAddNewTask.addEventListener("click", function() {
    addNewTask.style.display = "none";
})

loginMenu.addEventListener("click", function() {
    modalLogin.style.display = "block";
    modalLogin.dataset.value="home-login";

})



//fb registro
var provider = new firebase.auth.FacebookAuthProvider();
function fbsign(){
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;
        let source = modalLogin.dataset.value;
        // The signed-in user info.
        var user = result.user;
        if (db.collection("users").doc(user.email)) {
            //evitamos borrar las tareas existentes
        } else {
            //creamos las primeras tareas
            defaultTask(user.email);
        }
        if (source == "reAuthDeleteUser") {
            deleteAccount(credential);
        } else if (source == "changePassword") {
            changePassword(credential);
        } else if (source == "changeEmail") {
            changeEmail(credential);
        }
        modalLogin.style.display = "none";
        modal.style.display = "none";
        //setupPosts(true);
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;

        // ...
      })
      .catch((error) => {
        
        // Handle Errors here.
        var errorCode = error.code;
        console.log(errorCode)
        var errorMessage = error.message;
        console.log(errorMessage)
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });
}


const googleButton = document.querySelectorAll("#googleBtn");
googleButton.forEach((googleBtn) =>
            googleBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                try {
                    var provider = new firebase.auth.GoogleAuthProvider();
                      auth.signInWithPopup(provider).then((result) => {
                        console.log(result.user.email);
                        console.log(result);
                        modalLogin.style.display = "none";
                        modal.style.display = "none";
                        let source = modalLogin.dataset.value;
                        //console.log("google sign in");
                        //console.log(result.user.email);
                        if (result.credential) {
                          /** @type {firebase.auth.OAuthCredential} */
                          var credential = result.credential;

                          // This gives you a Google Access Token. You can use it to access the Google API.
                          var token = credential.accessToken;
                          // ...
                        }
                        // The signed-in user info.
                        var user = result.user;
                        if (db.collection("users").doc(result.user.email)) {
                            //evitamos borrar las tareas existentes
                            if (source =="reAuthDeleteUser" ) {
                                deleteAccount(credential);


                               

                            } else if (source =="changePassword") {
                                changePassword(credential);
                            } else if(source ="changeEmail"){
                                changeEmail(credential)
                                
                            }
                        } else {
                            //creamos las primeras tareas
                            defaultTask(result.user.email);
                            
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      })

                
                } catch (error) {
                    //console.log(error);
                }
            })
        );




//registro

var signUpIMG = [];
const signUpForm = document.querySelector("#signup-form");
signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let email = signUpForm["signup-email"].value;
    let password = signUpForm["signup-password"].value;
    let name = signUpForm["signup-name"].value;
    console.log(email, password, name)
    auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {

            //setupUserData(email,date,name);
            // clear the form
            signUpForm.reset();
            

            defaultTask(email);
            setMoreData(name);
            
            // close the modal
            modal.style.display = "none";
        })
        .catch((error) => {
            var errorCode = error.code;
            if (errorCode == 'auth/email-already-in-use') {
                console.log("correo en uso");
                //pendiente programar muestra de errores en formulario
            } else{
                console.log("error desconocido");
                //pendiente programar muestra de errores en formulario
            }
            
            var errorMessage = error.message;
            console.log(errorCode);
            // ..
          });



    
});

//pendiente dropear imagen funciona seleccionarla no
async function setMoreData(nombre){
    //console.log(name)
    let user = await firebase.auth().currentUser;
    var storageRef = firebase.storage().ref('profile_picture/'+user.uid);

    if (signUpIMG.length>=1) {
        let nombreImg=signUpIMG[signUpIMG.length-1].name;
        let file = signUpIMG[signUpIMG.length-1];
        var task = storageRef.put(file);
    } else {
    
    }
    
    
    //console.log(file);
    
    

    
    await user.updateProfile({
      displayName: nombre
    }).then(() => {
      setTimeout(printUserData,3000);
    }).catch((error) => {
      // An error occurred
      // ...
    });  

}



//primera tarea por defecto en nuevo resgistro
function defaultTask(email ){
    let dateEnd = new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 10)
    let date = new Date();
    db.collection("users").doc(email).set({
        
            tasks : [
            {
                title: "Esta es tu primera tarea",
                description: "La descripcion es opcional",
                status: false,
                date: new Date(),
                date_end: dateEnd.toLocaleDateString('pt-br').split('/').reverse().join('-') + "T" + addZero(dateEnd.getHours()) + ":" + addZero(dateEnd.getMinutes())
            },
            {
                title: "Esta es una tarea compleatada",
                description: "Esta es tu primera descripcion de una tarea",
                status: true,
                date: new Date(),
                date_end: dateEnd.toLocaleDateString('pt-br').split('/').reverse().join('-') + "T" + addZero(dateEnd.getHours()) + ":" + addZero(dateEnd.getMinutes())
            },
            {
                title: "Esta es una tarea expirada",
                description: "Cuando una tarea no se completa antes del tiempo limite pasara a esta seccion",
                status: false,
                date: new Date(),
                date_end: date.toLocaleDateString('pt-br').split('/').reverse().join('-') + "T" + addZero(dateEnd.getHours()) + ":" + addZero(dateEnd.getMinutes())
            }
            ]
        
        


    });
    
};




//login

const signInForm = document.querySelector("#login-form");

signInForm.addEventListener("submit", async(e) => {
    let source = modalLogin.dataset.value;
    
    e.preventDefault();
    const email = signInForm["login-email"].value;
    const password = signInForm["login-password"].value;
    
    await login(email,password,source);
    
    
});


async function login(email,password,source){
    // Authenticate the User
    await auth.signInWithEmailAndPassword(email, password).then((userCredential) => {

        // clear the form
        signInForm.reset();
        // close the modal
        if (source == "home-login") {
            modalLogin.style.display = "none";
            setupPosts(true,email);
        } else if (source == "reAuthDeleteUser") {
            if (true) {}
            deleteAccount(null,email,password);
        } else if(source =="changePassword"){
            changePassword(null, email,password);
        } else if (source == "changeEmail") {
            changeEmail(null,email,password)
        }
        
        
    })
    .catch((error) => {
            var errorCode = error.code;
            if (errorCode == 'auth/user-not-found') {
                console.log("correo no encontrado");
                //pendiente programar muestra de errores en formulario
            } else if (errorCode == 'auth/wrong-password'){
                console.log("password incorrecta");
                //pendiente programar muestra de errores en formulario
            }
            
            var errorMessage = error.message;
            console.log(errorCode);
            // ..
          });
}

// Logout
const logout = document.querySelector("#log_out");

logout.addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("signup out");
    });
});



// list for auth state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        //console.log(user.email)
        //console.log("signin");
        loginCheck(user);
        setupPosts(true, user.email);
        console.log(user.uid)
        //addDate();
        printUserData();
        //console.log(user.providerData)

        

    } else {

        //console.log("signout");
        loginCheck(user);

    }
});

   let btnMenu = document.querySelector("#btn");
   let sidebar = document.querySelector(".sidebar");
   let searchBtn = document.querySelector(".bx-search");

   btnMenu.onclick = function() {
     sidebar.classList.toggle("active");
   }
   searchBtn.onclick = function() {
     sidebar.classList.toggle("active");
   }



let name_details = document.getElementById("name_details");
let userPic = document.getElementById("user_pic");

async function printUserData(){
    let user =  firebase.auth().currentUser;
    //var storageRef = firebase.storage().ref('profile_picture/'+user.uid);

    
    //console.log(user.photoURL)
    
    let picture = await getPicture(user.photoURL,user);
    if (picture == null || picture == undefined) {
        console.log("la imagen es nula o indefinida")
    } else{
        userPic.src = picture;
        modalAccount.querySelector("#photoURL").src=picture;
    }

 
    modalAccount.querySelector("#user").innerHTML=`${user.displayName}`
    modalAccount.querySelector("#email").innerHTML=`${user.email}` 
    
    
     
      
    let name = user.displayName;
    let email = user.email;
    name_details.innerHTML=`<div id="user_name" class="name">${name}</div>
                         <div id="user_email" class="user_email">${email}</div>`
    //var forestRef = storageRef.child('profile_picture/'+ user.uid);
    //console.log(forestRef)
    //console.log(user.photoURL);
   
}

async function getPicture(picture,user){
    const storage = await firebase.storage();
    var imgRef = await storage.ref('profile_picture/'+user.uid).getDownloadURL().catch(function(error) {});

    if (imgRef) {
        return imgRef;
    } else if (imgRef == null && picture) {
        return user.photoURL
        
    } else{
        return "user_picture.png"
    }


}





document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");

  dropZoneElement.addEventListener("click", (e) => {
    inputElement.click();
  });

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateThumbnail(dropZoneElement, inputElement.files[0]);
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length && e.dataTransfer.files[0].type.startsWith("image/")) {
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
     
    }

    dropZoneElement.classList.remove("drop-zone--over");
  });
});

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */
function updateThumbnail(dropZoneElement, file) {
  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

  // First time - remove the prompt
  if (dropZoneElement.querySelector(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove();
  }

  // First time - there is no thumbnail element, so lets create it
  if (!thumbnailElement) {
    thumbnailElement = document.createElement("div");
    thumbnailElement.classList.add("drop-zone__thumb");
    dropZoneElement.appendChild(thumbnailElement);
  }

  thumbnailElement.dataset.label = file.name;

  // Show thumbnail for image files
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    signUpIMG.push(file);
    reader.readAsDataURL(file);
    reader.onload = () => {
        if (!(modalAccount.style.display == "none")) {
            document.getElementById("photoURL").src=reader.result;
            let user = firebase.auth().currentUser;
            let name = user.name;
            setMoreData(name);
          } else {
            thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
            
          }
      
    };
  } else {
    thumbnailElement.style.backgroundImage = null;
  }

  
}




var searchSection = document.getElementById("search-section");    
var inputSearch = document.getElementById("search");
let searchError = document.getElementById("search-error");
inputSearch.addEventListener("keyup", async function(e) {

    console.log("esta teclendo", inputSearch.value)
    
    let user = await firebase.auth().currentUser;
    let email = user.email;
    let data = await getUserTasks(email);
    let tareas = data.tasks;
    let results = [];
    console.log(results);
    searchError.style.display="none";
    tasksContainer.style.display="inline-block";
    
    for (var i = tareas.length - 1; i >= 0; i--) {
        var final = tareas[i].title.includes(inputSearch.value);
        console.log(inputSearch.value.length)
        if (final == true && inputSearch.value.length > 0) {     
            results.push(tareas[i]);
        } else{
           
        }
               
    }
    if (results.length==0) {
        console.log("no hay resultados de busqueda para ", inputSearch.value);
        searchError.style.display="inline-block";
        tasksContainer.style.display="none";
        

    } else{
        await setTasks(results,email,searchSection);
    }
    if (inputSearch.value.length == 0) {
        await setTasks(tareas,email,searchSection);
        tasksContainer.style.display="inline-block";
        searchError.style.display="none";

    }
    
    
    
            
        

});









