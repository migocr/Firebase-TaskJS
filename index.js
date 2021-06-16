var db = firebase.firestore();


const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");
const taskFormEdit = document.getElementById("task-form-edit");




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
  var newDefaultDate = new Date().toLocaleDateString('pt-br').split( '/' ).reverse( ).join( '-' )+"T"+addZero(dateNow.getHours())+":"+addZero(dateNow.getMinutes());
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
  } else {
    loggedInLinks.forEach((link) => (link.style.display = "none"));
    loggedOutLinks.forEach((link) => (link.style.display = "block"));
  }
};

/**
 * Save a New Task in Firestore
 * @param {string} title the title of the Task
 * @param {string} description the description of the Task
 */





const saveTask = (user, title, description,dateEnd) =>
  
  db.collection("users").doc(email).update({

    
    tasks: firebase.firestore.FieldValue.arrayUnion({
              title: title,
              description: description,
              status: false,
              date: new Date(),
              date_end:dateEnd
             
            })
    
  });

 


const getTasks = () => db.collection("users").get();

//const onGetTasks = (callback) => db.collection("tasks").onSnapshot(callback);
const onGetTasks = (callback) => db.collection("users").onSnapshot(callback);
//const deleteTask = (id) => db.collection("users").doc(id.tasks).delete();


//var tareasDelUsuario = [];
async function deleteTask(id,email,tareasDelUsuario){
console.log(tareasDelUsuario)
var task = tareasDelUsuario[id];
var docRef = db.collection("users").doc(email);
 await docRef.update({
   tasks: firebase.firestore.FieldValue.arrayRemove(task)
})

};
async function editTask(id,email){
  
};


const getTask = (id) => db.collection("users").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('users').doc(id).update(updatedTask);

//filtro por tareas completadas o no completadas
document.getElementById("dropdown-menu").addEventListener("click", function(e){
  let filtro = e.target.id;
  console.log(filtro);
  auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user.email)
    setupPosts(true,user.email,filtro)
  } else {
    console.log("error de inicio de sesion")
    }
  });
})


const setupPosts = async(e,email,filter) => {
  console.log(e);
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";
    var tareasDelUsuario = [];
    querySnapshot.forEach((doc) => {
      let id = email;
      const users = doc.data();
      //console.log(doc.id);
      //console.log(tareas)
      let tareas = users.tasks;
      if (e) {
        //let status = users.tasks[0].status;
        //console.log(status);
        if (doc.id == email && tareas) {
          
          
          //console.log("es igual")
          //console.log(users.tasks)
          //console.log(tareasDelUsuario);
          for (var i = 0; i <= tareas.length-1; i++) {

          tareasDelUsuario.push(tareas[i]);
          var reverseID = ((tareas.length-i)-1);


          if (tareas[reverseID].status) {
            var checked = "checked";
            //console.log("es true")
          } else {
            var checked = "";
          }

          let newDate = new Date();
          let oldDate =  new Date(tareas[reverseID].date_end);

          var fechaInicio = new Date(newDate).getTime();
          var fechaFin    = new Date(oldDate).getTime();
          var diff = fechaFin - fechaInicio;
          var diffDias = diff/(1000*60*60*24);
          var diffHoras = (diff%(1000*60*60*24)/3.6e+6);
          var diffMinutos = (diff%(1000*60*60*24)%3.6e+6)/60000;
          //console.log(tareas[reverseID])
          //console.log("Dias ",Math.trunc(diffDias) ,"Horas ", Math.trunc(diffHoras) ,"Minutos " , Math.trunc(diffMinutos));
          if ( newDate > oldDate ) {
            var task_at_time = ("Tarea caduco hace: " + Math.trunc(diffDias)*-1 + " Dias " + Math.trunc(diffHoras)*-1 + " Horas " + Math.trunc(diffMinutos)*-1 + " Minutos");
            var task_at_time_color = "alert-dark"
          } else if (new Date() == new Date(tareas[reverseID].date_end) ) {
            //console.log("son iguales")
          } else{
             var task_at_time = ("Tiempo restante: " + Math.trunc(diffDias) + " Dias " + Math.trunc(diffHoras) + " Horas " + Math.trunc(diffMinutos) + " Minutos");
             var task_at_time_color = "alert-success"
          }
          const printTask = async(taskTitle,taskDescription,reverseID,checked,task_at_time_color,task_at_time) => {
            tasksContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
              <div class="panel panel-success"></div>
              <h3 class="h5">${taskTitle}</h3>
              <p>${taskDescription}</p>
              <div>
                <button class="btn btn-primary btn-delete" data-id="${reverseID}">
                  🗑 Delete
                </button>
                <button class="btn btn-secondary btn-edit" data-id="${reverseID}">
                  🖉 Edit
                </button>
                <label class="switch">
                  <input type="checkbox" ${checked}>
                  
                  <span data-id="${reverseID}" class="slider round" id="switchStatus"></span>

                </label>
                <div class="alert ${task_at_time_color}" role="alert">
                  ${task_at_time} 
                </div>
               </div>
              </div>`;
            }

          let taskTitle = tareas[reverseID].title;
          let taskDescription = tareas[reverseID].description;
          if (filter == "all") {
            printTask(taskTitle,taskDescription,reverseID,checked,task_at_time_color,task_at_time);
            
          } else if(filter =="check"){
            if (tareas[reverseID].status) {
              printTask(taskTitle,taskDescription,reverseID,checked,task_at_time_color,task_at_time);
            } 
          } else if (filter == "uncheck") {
            if (!(tareas[reverseID].status)) {
              printTask(taskTitle,taskDescription,reverseID,checked,task_at_time_color,task_at_time);
            } 
          }

          
           }
          
        }else{

        }
        
        addNote.style.display ="block";
        
      } else{
        addNote.style.display ="none";
        tasksContainer.innerHTML += `NO DATA`;
      }

      
    });

    const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        //console.log(tareasDelUsuario);
        try {
          //console.log(tareasDelUsuario)
          await deleteTask(e.target.dataset.id,email,tareasDelUsuario);
        } catch (error) {
          //console.log(error);
        }
      })
    );

    const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
    let position = [];
    let oldTask = [];
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getTask(email);
          const users = doc.data();
          oldTask.push(users.tasks[e.target.dataset.id]);
          //console.log(users.tasks[e.target.dataset.id]);
          taskFormEdit["task-title"].value = users.tasks[e.target.dataset.id].title;
          taskFormEdit["task-description"].value = users.tasks[e.target.dataset.id].description;
          //let taskEditId = e.target.dataset.id;
          //editStatus = true;
          //id = email;
          //taskForm["btn-task-form"].innerText = "Update";
          modalEditTask.style.display="block";
          //editTask(e.target.dataset.id.email)
          position.push(e.target.dataset.id);

        } catch (error) {
          console.log(error);
        }
        
      });
    });

    //escucha el switch de status y lo cambia si se le da click
    const btnStatus = tasksContainer.querySelectorAll("#switchStatus");
    btnStatus.forEach((btnStat) =>
      btnStat.addEventListener("click", async (e) => {
      
        try {
          let taskStatus = tareasDelUsuario[e.target.dataset.id].status;
          let taskTitle = tareasDelUsuario[e.target.dataset.id].title;
          let taskDescription = tareasDelUsuario[e.target.dataset.id].description;
          let taskDate = tareasDelUsuario[e.target.dataset.id].date;
          let taskDateEnd = tareasDelUsuario[e.target.dataset.id].date_end;
          let arrayTask = [taskTitle,taskDescription]

          let editedTasks = [];
          //console.log(e.target.dataset.id)
          //console.log({title: taskTitle, description: taskDescription,status:taskStatus});

          for (var i = 0; i <= tareasDelUsuario.length-1; i++) {
          if (i == e.target.dataset.id) {
      
            editedTasks.push({title: taskTitle, description: taskDescription, status:!taskStatus,date:taskDate,date_end: taskDateEnd});
          } else{
            //console.log("tarea no editada"+i);
            editedTasks.push(tareasDelUsuario[i]);
          }
        }
        console.log(editedTasks);
        db.collection("users").doc(email).update({
          tasks: editedTasks
        })


          
        } catch (error) {
          console.log(error);
        }
      })
    );


    

    document.getElementById("buttonUpdate").addEventListener("click", function() {
      //var oldTask = [taskFormEdit["task-title"].value , taskFormEdit["task-description"].value];
      modalEditTask.style.display="none";
      //console.log(position);
      let editedTasks = [];
      let status = tareasDelUsuario[position].status;
      let date = tareasDelUsuario[position].date;
      let date_end = tareasDelUsuario[position].date_end;
      let editedTitle = taskFormEdit["task-title"].value;
      let editedDescription = taskFormEdit["task-description"].value;
      //console.log(editedTitle + editedDescription);
      //console.log(position[position.length-1]);
      //console.log(oldTask[oldTask.length-1])
      //console.log(taskFormEdit["task-title"].value);
      //console.log(tareasDelUsuario);
      for (var i = 0; i <= tareasDelUsuario.length-1; i++) {
        if (i == position[position.length-1]) {
          //console.log("tarea editada"+i)

          editedTasks.push({title: editedTitle, description: editedDescription, status:status,date:date,date_end:date_end});
        } else{
          //console.log("tarea no editada"+i);
          editedTasks.push(tareasDelUsuario[i]);
        }
      }
      
      console.log(status);
      db.collection("users").doc(email).update({
          tasks: editedTasks
        })
    });


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

      await saveTask(email,title.value, description.value,date.value);
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
const btnClose =document.getElementById('btn-close');
const btnCloseLogin =document.getElementById('btn-close-login');
const btnCloseEditTask =document.getElementById('btn-close-et');

register.addEventListener("click", function () {
  modal.style.display="block";
 
})

btnClose.addEventListener("click",function(){
  modal.style.display="none";
})
btnCloseLogin.addEventListener("click",function(){
  modalLogin.style.display="none";
})
btnCloseEditTask.addEventListener("click",function(){
  modalEditTask.style.display="none";
})

login.addEventListener("click", function () {
  modalLogin.style.display="block";
  
})

//registro
const signUpForm = document.querySelector("#signup-form");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signUpForm["signup-email"].value;
  const password = signUpForm["signup-password"].value;

  // Authenticate the User
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // clear the form
      signUpForm.reset();
      let date = new Date();
      defaultTask(email,date);
      // close the modal
      modal.style.display="none";
    });
});


//primera tarea por defecto en nuevo resgistro
const defaultTask = (email, date) =>


  db.collection("users").doc(email).set({

    tasks: firebase.firestore.FieldValue.arrayUnion({
              title: "Esta es tu primera tarea",
              description: "Esta es tu primera descripcion de una tarea",
              status: false
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
    modalLogin.style.display="none";
    setupPosts(e,email);
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
    setupPosts(true,user.email,"all");
    addDate();
    
  } else {
    
    //console.log("signout");
    loginCheck(user);
    setupPosts(false);
  }
});
