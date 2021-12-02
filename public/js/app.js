const loggedOutIn = document.querySelectorAll('.logged-out');
const loggedIn = document.querySelectorAll('.logged-in');
const createContact = document.querySelectorAll('.createContact');

const loginCheck = user => {
    if (user) {
        loggedIn.forEach(link => link.style.display = 'block');
        loggedOutIn.forEach(link => link.style.display = 'none');
        createContact.forEach(link => link.style.display = 'block');
    } else {
        loggedIn.forEach(link => link.style.display = 'none');
        loggedOutIn.forEach(link => link.style.display = 'block');
        createContact.forEach(link => link.style.display = 'none');
    }
}


// Registrarse
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#signup-email').value;
    const password = document.querySelector('#signup-password').value;

    auth
        .createUserWithEmailAndPassword(email,password)
        .then(userCredential => {
            signupForm.reset();
            $('#signupModal').modal('hide')
            console.log('sign up');
        })    
});

// Iniciar sesión
const signinForm = document.querySelector('#signin-form');

signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#signin-email').value;
    const password = document.querySelector('#signin-password').value;
      auth
        .signInWithEmailAndPassword(email,password)
        .then(userCredential => {   
          signinForm.reset();
          $('#signinModal').modal('hide')
          console.log('sign in');
          window.location.reload();  
        })        
});

// Login Google
const googleBtn = document.querySelector('#googleLogin');
googleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    auth
        .signInWithPopup(provider)
        .then(result => {
            signupForm.reset();
            $('#signinModal').modal('hide')
        })
        .catch(err => {
            console.log(err);
        })
});

// Login Facebook
const facebookBtn = document.querySelector('#facebookLogin');
facebookBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const provider = new firebase.auth.FacebookAuthProvider();
    auth
        .signInWithPopup(provider)
        .then(result => {
            $('#signinModal').modal('hide')
            console.log(result);
            console.log('facebook sign in')
        })
        .catch(err => {
            console.log(err);
        })
});

// Cerrar Sesión
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('sign out');
    })
});

$(window).on('load', function() {
  $('body').addClass('loaded');
});


auth.onAuthStateChanged(user => {
    if (!user) {        
        loginCheck(user);        
    } else {
        loginCheck(user);
    }
})


// Twitter Login
// const botonFacebook = document.querySelector("#twitterLogin");
// botonFacebook.addEventListener("click", () => {
//   const provider = new firebase.auth.TwitterAuthProvider();
//   auth
//     .signInWithPopup(provider)
//     .then((result) => {
//       var user = result.user;
//       myStorage.setItem("email", "twitter");
//       myStorage.setItem("user", user.displayName);
//       myStorage.setItem("userFoto", user.photoURL);
//       IngresoModal.hide();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });