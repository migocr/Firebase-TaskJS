var db = firebase.firestore();


const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("accordionExample");
const tasksContainerPending = document.getElementById("tasks-container-pending");
const tasksContainerComplete = document.getElementById("tasks-container-complete");
const tasksContainerExpired = document.getElementById("tasks-container-expired");
const taskFormEdit = document.getElementById("task-form-edit");
const accordionTasks = document.getElementById("accordionExample");
const visitorPage = document.getElementById("visitor");

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

async function addDate() {
    const defaultDate = document.getElementById('date-end');
    var dateNow = new Date();
    var newDefaultDate = new Date().toLocaleDateString('pt-br').split('/').reverse().join('-') + "T" + addZero(dateNow.getHours()) + ":" + addZero(dateNow.getMinutes());
    defaultDate.value = await newDefaultDate;
    return newDefaultDate;
}




let editStatus = false;
let id = '';


const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");




const loginCheck = (user) => {
    if (user) {
        loggedInLinks.forEach((link) => (link.style.display = "block"));
        loggedOutLinks.forEach((link) => (link.style.display = "none"));
        accordionExample.style.display = "block";
        btnNewTask.style.display = "inline-block";
        visitorPage.style.display = "none";

    } else {
        loggedInLinks.forEach((link) => (link.style.display = "none"));
        loggedOutLinks.forEach((link) => (link.style.display = "block"));
        //accordionExample.style.display="none";
        btnNewTask.style.display = "none";
        accordionTasks.style.display = "none";
        visitorPage.style.display = "block";

    }
};

/**
 * Save a New Task in Firestore
 * @param {string} title the title of the Task
 * @param {string} description the description of the Task
 */




const saveTask = (user, title, description, dateEnd) =>

    db.collection("users").doc(email).update({


        tasks: firebase.firestore.FieldValue.arrayUnion({
            title: title,
            description: description,
            status: false,
            date: new Date(),
            date_end: dateEnd

        })


    });




const getTasks = () => db.collection("users").get();

//const onGetTasks = (callback) => db.collection("tasks").onSnapshot(callback);
const onGetTasks = (callback) => db.collection("users").onSnapshot(callback);
//const deleteTask = (id) => db.collection("users").doc(id.tasks).delete();


//var tareasDelUsuario = [];
async function deleteTask(id, email, tareasDelUsuario) {
    console.log(id)
    let tasks = tareasDelUsuario[0];
    let task = tasks[id];
    var docRef = db.collection("users").doc(email);
    await docRef.update({
        tasks: firebase.firestore.FieldValue.arrayRemove(task)
    })

};
async function editTask(id, email) {

};


const getTask = (id) => db.collection("users").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('users').doc(id).update(updatedTask);

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




const printTask = async (taskTitle, taskDescription, i, checked, task_at_time_color, task_at_time, section, borderCard) => {

    section.innerHTML += `<div id="post" data-id="${i}" class="card card-body border-left" style="${borderCard}">

            

            <div id="postCheck"  class="round">
              <input type="checkbox" class="checkbox-circle" id="checkbox" name="${taskTitle}" ${checked}>
              <label for="${taskTitle}" data-id="${i}" value ="${i}">
              </label>
            </div>
            <h3 style="display:inline-block; padding-left:2em;" data-id="${i}" class="h5">${taskTitle}</h3>
            
              

              
              
              
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

const setupPosts = async (e, email) => {


    onGetTasks((querySnapshot) => {
        tasksContainerPending.innerHTML = "";
        tasksContainerComplete.innerHTML = "";
        tasksContainerExpired.innerHTML = "";
        var tareasDelUsuario = [];
        querySnapshot.forEach((doc) => {
            let id = email;

            const users = doc.data();
            let tareas = users.tasks;



            if (e) {
                //let status = users.tasks[0].status;
                //console.log(status);
                if (doc.id == email && tareas) {
                    //console.log(tareasDelUsuario)
                    //var newtareas = new Date();

                    tareas.sort(function(a, b) {
                        //console.log()
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


                    //newtareas.reverse();
                    //console.log(tareas);
                    tareasDelUsuario.push(tareas)


                    //console.log(users.tasks)
                    //console.log(tareasDelUsuario);
                    let pendingTaskCount = 0;
                    let completeTaskCount = 0;
                    let expiredTaskCount = 0;
                    for (var i = tareas.length - 1; i >= 0; i--) {

                        //var reverseID = ((tareas.length-i)-1);




                        let newDate = new Date();
                        let endDate = new Date(tareas[i].date_end);

                        var fechaInicio = new Date(newDate).getTime();
                        var fechaFin = new Date(endDate).getTime();
                        var diff = fechaFin - fechaInicio;
                        var diffDias = diff / (1000 * 60 * 60 * 24);
                        var diffHoras = (diff % (1000 * 60 * 60 * 24) / 3.6e+6);
                        var diffMinutos = (diff % (1000 * 60 * 60 * 24) % 3.6e+6) / 60000;
                        //console.log(tareas[i])
                        //console.log("Dias ",Math.trunc(diffDias) ,"Horas ", Math.trunc(diffHoras) ,"Minutos " , Math.trunc(diffMinutos));
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

                        //console.log(taskTitle)
                        let taskDescription = tareas[i].description;
                        if (endDate >= newDate && !tareas[i].status) {
                            pendingTaskCount++;
                            //console.log(pendingTaskCount)
                            let borderCard = "border-color: #52c28a!important";
                            printTask(taskTitle, taskDescription, i, checked, task_at_time_color, task_at_time, tasksContainerPending, borderCard);
                        } else if (tareas[i].status) {
                            completeTaskCount++
                            let borderCard = "border-color: #527ac2!important";
                            printTask(taskTitle, taskDescription, i, checked, task_at_time_color, task_at_time, tasksContainerComplete, borderCard);

                        } else if (newDate > endDate) {
                            expiredTaskCount++
                            let borderCard = "border-color: #62656b!important";
                            printTask(taskTitle, taskDescription, i, checked, task_at_time_color, task_at_time, tasksContainerExpired, borderCard);
                        }


                        //console.log(menuSelected)
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




                    }
                    document.getElementById("taskCompleteCount").innerHTML=`${completeTaskCount} Tasks Complete`;
                    document.getElementById("taskExpiredCount").innerHTML=`${expiredTaskCount} Tasks Expired`;
                    document.getElementById("taskPendingCount").innerHTML=`${pendingTaskCount} Tasks Pending`;
                    console.log(completeTaskCount)

                } else {

                }



            } else {

                accordionTasks.innerHTML += `NO DATA`;
            }


        });

        const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
        btnsDelete.forEach((btn) =>
            btn.addEventListener("click", async (e) => {
                //console.log(tareasDelUsuario);
                try {
                    //console.log(tareasDelUsuario)

                    await deleteTask(e.target.dataset.id, email, tareasDelUsuario);
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

                    let tasks = tareasDelUsuario[0];
                    //console.log(users.tasks[e.target.dataset.id]);
                    taskFormEdit["task-title"].value = tasks[e.target.dataset.id].title;
                    taskFormEdit["task-description"].value = tasks[e.target.dataset.id].description;
                    //let taskEditId = e.target.dataset.id;
                    //editStatus = true;
                    //id = email;
                    //taskForm["btn-task-form"].innerText = "Update";
                    modalEditTask.style.display = "block";
                    //editTask(e.target.dataset.id.email)


                } catch (error) {
                    console.log(error);
                }

            });

        });


        //update data
        const buttonUpdateTask = document.querySelector("#buttonUpdate");
        buttonUpdateTask.addEventListener("click", (e) => {
            e.preventDefault();
            let id = (e.target.value);
            let tareas = tareasDelUsuario[0];
            modalEditTask.style.display = "none";
            let editedTitle = taskFormEdit["task-title"].value;
            let editedDescription = taskFormEdit["task-description"].value;
            tareas[id] = {
                title: editedTitle,
                description: editedDescription,
                status: tareas[id].status,
                date: tareas[id].date,
                date_end: tareas[id].date_end
            };
            db.collection("users").doc(email).update({
                tasks: tareas
            });
        });



        const postCard = document.querySelectorAll("#post");
        postCard.forEach((pCard) =>
            pCard.addEventListener("click", (e) => {
                e.preventDefault();
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


        //escucha el switch de status y lo cambia si se le da click
        const btnStatus = document.querySelectorAll(".checkbox-circle");
        const postCheck = document.querySelectorAll("#postCheck");
        console.log("btn status" + btnStatus.length);
        postCheck.forEach((btnStat) =>
            btnStat.addEventListener("click", async (e) => {
                console.log(e.target.dataset.id)
                var id = (e.target.dataset.id);
                //console.log(tareasDelUsuario[e.target])
                try {
                    let tasks = tareasDelUsuario[0];
                    console.log(tasks)
                    let taskStatus = tasks[id].status;
                    let taskTitle = tasks[id].title;
                    let taskDescription = tasks[id].description;
                    let taskDate = tasks[id].date;
                    let taskDateEnd = tasks[id].date_end;
                    tasks[id] = {
                        title: taskTitle,
                        description: taskDescription,
                        status: !taskStatus,
                        date: taskDate,
                        date_end: taskDateEnd
                    };


                    //console.log(e.target.dataset.id)
                    //console.log({title: taskTitle, description: taskDescription,status:taskStatus});



                    db.collection("users").doc(email).update({
                        tasks: tasks
                    })



                } catch (error) {
                    console.log(error);
                }
            })
        );




    });
};




taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    await auth.onAuthStateChanged((user) => {
        email = user.email;

    });

    //console.log(email);

    const title = taskForm["task-title"];
    const description = taskForm["task-description"];
    const date = taskForm["date-end"];

    try {
        if (!editStatus) {

            await saveTask(email, title.value, description.value, date.value);
            await setupPosts(true, email)
        } else {
            await updateTask(tasks, {

                title: title.value,
                description: description.value,
            })

            editStatus = false;
            id = '';
            taskForm['btn-task-form'].innerText = 'Save';
        }

        taskForm.reset();
        title.focus();
    } catch (error) {
        console.log(error);
    }
    addDate();
});

const register = document.getElementById('register');
const login = document.getElementById('login');
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

login.addEventListener("click", function() {
    modalLogin.style.display = "block";

})




//registro
const signUpForm = document.querySelector("#signup-form");
signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = signUpForm["signup-email"].value;
    const password = signUpForm["signup-password"].value;
    let date = new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 10)
    // Authenticate the User
    auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // clear the form
            signUpForm.reset();

            defaultTask(email, date);
            // close the modal
            modal.style.display = "none";
        });
});



//primera tarea por defecto en nuevo resgistro
const defaultTask = (email, dateEnd) =>


    db.collection("users").doc(email).set({

        tasks: firebase.firestore.FieldValue.arrayUnion({
            title: "Esta es tu primera tarea",
            description: "Esta es tu primera descripcion de una tarea",
            status: false,
            date: new Date(),
            date_end: dateEnd.toLocaleDateString('pt-br').split('/').reverse().join('-') + "T" + addZero(dateEnd.getHours()) + ":" + addZero(dateEnd.getMinutes())

        })


    });

//login

const signInForm = document.querySelector("#login-form");

signInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = signInForm["login-email"].value;
    const password = signInForm["login-password"].value;

    // Authenticate the User
    auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
        // clear the form
        signInForm.reset();
        // close the modal
        modalLogin.style.display = "none";
        setupPosts(true, email);
    });
});

// Logout
const logout = document.querySelector("#logout");

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
        addDate();

    } else {

        //console.log("signout");
        loginCheck(user);

    }
});