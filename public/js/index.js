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



// TODO: SUBIR UNA IMAGEN
var subirImagen = (file, uid) => {
    const imagenesStorage = firebase
      .storage()
      .ref(`imagenes/${uid}/${file.name}`);
    const taskImagen = imagenesStorage.put(file);
    taskImagen.on(
        'state_changed',
        (snapshot) => {
            const porcentaje =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.getElementById("progressImagen").style.width = `${porcentaje}%`;
        },
        (err) => {
            Swal.fire({
                icon: 'error',
                title: `La imagen no debe pesar más de 5mb`,
                text: 'Algo salió mal!',
            })
        },
        () => {
            taskImagen.snapshot.ref
            .getDownloadURL()
            .then((url) => {
                console.log(url);
                sessionStorage.setItem("imgNewPost", url);
            })
            .catch((err) => {
                alert(`Error obteniendo downlaodURL Imagen => ${err.message}`);
            });
        }
    );
};

// TODO: SUBIR UN ARCHIVO EXCEL
var subirExcel = (file, uid) => {
    const excelsStorage = firebase.storage().ref(`excels/${uid}/${file.name}`);
    const taskExcel = excelsStorage.put(file);
    taskExcel.on(
      "state_changed",
      (snapshot) => {
        const porcentaje =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById("progressExcel").style.width = `${porcentaje}%`;
      },
      (err) => alert(`Error subiendo el Excel => ${err.message}`),
      () => {
        taskExcel.snapshot.ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            sessionStorage.setItem("excNewPost", url);
          })
          .catch((err) => {
            alert(`Error obteniendo downlaodURL Excel => ${err.message}`);
          });
      }
    );
};

document.getElementById("formFileImagen").addEventListener("change", e => {
    const file = e.target.files[0];
    const user = firebase.auth().currentUser;
    subirImagen(file, user.uid);
  })
  
document.getElementById("formFileExcel").addEventListener("change", e => {
    const file = e.target.files[0];
    const user = firebase.auth().currentUser;
    subirExcel(file, user.uid);
})


// Crear, listar, actualizar y eliminar
const createBtn = document.getElementById('createLibro');
const updateBtn = document.getElementById('updateLibro');
const containerLibro = document.querySelector('#containerLibro');


let updateStatus = false;
let id = '';

const getLibros = () => db.collection('libros').get();
const getLibro = (id) => db.collection('libros').doc(id).get();

const onGetLibros = (callback) => db.collection('libros').onSnapshot(callback);
const deleteLibro = id => db.collection('libros').doc(id).delete();
const updateLibro = (id, updatedLibro) => db.collection('libros').doc(id).update(updatedLibro);

window.addEventListener('DOMContentLoaded', async (e) => {    
    onGetLibros((querySnapshot) => {
        containerLibro.innerHTML = '';
        querySnapshot.forEach(doc => {
            
            const libro = doc.data();
            libro.id = doc.id;

            containerLibro.innerHTML += `<tr>
                <th>${libro.name}</th>
                <th>${libro.autor}</th>
                <th>${libro.genero}</th>
                <th>${libro.paginas}</th>
                <td><a href='${libro.imagenUrl}'><img src='${libro.imagenUrl}' width='50px' height='50px'></a></td>
                <td><a href='${libro.excelUrl}'><i class="fas fa-file-excel"></i></a></td>
                <th>
                    <button class="btn btn-danger btn-delete" data-id="${libro.id}">Eliminar</button>
                </th>
            </tr>
            `;
            const btnDelete = document.querySelectorAll('.btn-delete');
            btnDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const doc = await getLibro(e.target.dataset.id);
                    console.log(doc.data());
                    const Libro = doc.data();
                    Swal.fire({
                        title: `¿Está seguro que deseas eliminar a ${Libro.name}?`,
                        text: "No podrás revertir esto!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, eliminar!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            deleteLibro(e.target.dataset.id);
                            Swal.fire(
                                'Eliminado!',
                                `El libro ${libro.name} fue Eliminado.`,
                                'success'
                            )
                        }
                    })
                    
                })
            });

            const btnUpdate = document.querySelectorAll('.btn-update');
            btnUpdate.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const doc = await getLibro(e.target.dataset.id);
                    console.log(doc.data());
                    $('#modalUpdateLibro').modal('show');
                    const libro = doc.data();

                    updateStatus = true;
                    id = doc.id;
                    console.log(id);

                    updateBtn['nameU'].value = libro.name;
                    updateBtn['autorU'].value = libro.autor;
                    updateBtn['generoU'].value = libro.genero;
                    updateBtn['paginasU'].value = libro.paginas;
                    updateBtn['formFileImagen'].file = libro.imagenUrl;
                    updateBtn['formFileExcel'].file = libro.excelUrl;
                })
            })
        });
    });    
});



updateBtn.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = updateBtn['nameU'];
    const autor = updateBtn['autorU'];
    const genero = updateBtn['generoU'];
    const paginas = updateBtn['paginasU']; 
    const imagenUrl = updateBtn['formFileImagen']; 
    const excelUrl = updateBtn['formFileExcel']; 
    
    const nameU = document.querySelector('#nameU').value;
    const autorU = document.querySelector('#autorU').value;
    const generoU = document.querySelector('#generoU').value;
    const paginasU = document.querySelector('#paginasU').value;
    const imagenUrlU = document.querySelector('#formFileImagen').file;
    const excelUrlU = document.querySelector('#formFileExcel').file;
    
    if (nameU != "" && autorU != "" && generoU != "" && paginasU != "" && imagenUrlU != "" && excelUrlU != "") {

        Swal.fire({
            icon: 'success',
            title: `El Libro ${nameU} fue actualizado`,
            showConfirmButton: false,
            timer: 1500
        }) 
        
        await updateLibro(id, {
            name: name.value,
            autor: autor.value,
            genero: genero.value,
            paginas: paginas.value,
            imagenUrl: sessionStorage.getItem('imgNewPost') == 'null'  ? null : sessionStorage.getItem('imgNewPost'),
            excelUrl: sessionStorage.getItem('excNewPost') == 'null'  ? null : sessionStorage.getItem('excNewPost')
        })

        updateBtn.reset();
        $('#modalUpdateLibro').modal('hide');

    } else {
        Swal.fire({
            icon: 'error',
            title: 'Complete todos los campos',
            showConfirmButton: false,
            timer: 1500
        }) 
    }
}) 
// 


createBtn.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const autor = document.querySelector('#autor').value;
    const genero = document.querySelector('#genero').value;
    const paginas = document.querySelector('#paginas').value;
    const imagenUrl = sessionStorage.getItem('imgNewPost') == 'null'  ? null : sessionStorage.getItem('imgNewPost')
    const excelUrl = sessionStorage.getItem('excNewPost') == 'null'  ? null : sessionStorage.getItem('excNewPost')

    if (name != "" && autor != "" && genero != "" && paginas != "") {
        Swal.fire({
            icon: 'success',
            title: `El Libro ${name} fue registrado`,
            showConfirmButton: false,
            timer: 1500
        })     
    
        await saveLibro(name,autor,genero,paginas,imagenUrl,excelUrl);
        createBtn.reset(); 
        $('#modalLibro').modal('hide');
        window.location.reload();
        
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Complete todos los campos',
            showConfirmButton: false,
            timer: 1500
        })   
    }
})

const saveLibro = (name,autor,genero,paginas,imagenUrl,excelUrl) => 
    db
    .collection('libros').doc().set({
        name,
        autor,
        genero,
        paginas,
        imagenUrl,
        excelUrl
    });