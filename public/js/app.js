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
          console.log('sign in');
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

auth.onAuthStateChanged((user) => {        
    if (user) {             
      location.replace("index.html")
    } 
})


// Twitter Login
const botonFacebook = document.querySelector("#twitterLogin");
botonFacebook.addEventListener("click", () => {
  const provider = new firebase.auth.TwitterAuthProvider();
  auth
    .signInWithPopup(provider)
    .then((result) => {
      var user = result.user;
      myStorage.setItem("email", "twitter");
      myStorage.setItem("user", user.displayName);
      myStorage.setItem("userFoto", user.photoURL);
      IngresoModal.hide();
    })
    .catch((err) => {
      console.log(err);
    });
});