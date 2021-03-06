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
var subirPDF = (file, uid) => {
    const pdfStorage = firebase.storage().ref(`pdfs/${uid}/${file.name}`);
    const taskPdf = pdfStorage.put(file);
    taskPdf.on(
      "state_changed",
      (snapshot) => {
        const porcentaje =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById("progressPdf").style.width = `${porcentaje}%`;
      },
      (err) => alert(`Error subiendo el PDF => ${err.message}`),
      () => {
        taskPdf.snapshot.ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            sessionStorage.setItem("pdfNewPost", url);
          })
          .catch((err) => {
            alert(`Error obteniendo downlaodURL PDF => ${err.message}`);
          });
      }
    );
};

document.getElementById("formFileImagen").addEventListener("change", e => {
    const file = e.target.files[0];
    const user = firebase.auth().currentUser;
    subirImagen(file, user.uid);
})
  
document.getElementById("formFilePdf").addEventListener("change", e => {
    const file = e.target.files[0];
    const user = firebase.auth().currentUser;
    subirPDF(file, user.uid);
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
                <td><a href='${libro.pdfUrl}'><i class="fas fa-file-pdf"></i></a></td>
                <th>
                    <button class="btn btn-danger btn-delete" data-id="${libro.id}">Eliminar</button>
                </th>
            </tr>
            `;
            const btnDelete = document.querySelectorAll('.btn-delete');
            btnDelete.forEach(btn => {
                auth.onAuthStateChanged((user) => {
                    btn.addEventListener('click', async (e) => {
                        if (!user) {        
                            Swal.fire({
                                icon: 'error',
                                title: 'Tienes que estar logueado para eliminar',
                                showConfirmButton: false,
                                timer: 1500
                            }) 
                        } else {                            
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
                    updateBtn['formFileExcel'].file = libro.pdfUrl;
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
    const pdfUrl = updateBtn['formFileExcel']; 
    
    const nameU = document.querySelector('#nameU').value;
    const autorU = document.querySelector('#autorU').value;
    const generoU = document.querySelector('#generoU').value;
    const paginasU = document.querySelector('#paginasU').value;
    const imagenUrlU = document.querySelector('#formFileImagen').file;
    const pdfUrlU = document.querySelector('#formFileExcel').file;
    
    if (nameU != "" && autorU != "" && generoU != "" && paginasU != "" && imagenUrlU != "" && pdfUrlU != "") {

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
            pdfUrl: sessionStorage.getItem('pdfNewPost') == 'null'  ? null : sessionStorage.getItem('pdfNewPost')
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
    const pdfUrl = sessionStorage.getItem('pdfNewPost') == 'null'  ? null : sessionStorage.getItem('pdfNewPost')

    if (name != "" && autor != "" && genero != "" && paginas != "") {
        Swal.fire({
            icon: 'success',
            title: `El Libro ${name} fue registrado`,
            showConfirmButton: false,
            timer: 1500
        })     
    
        await saveLibro(name,autor,genero,paginas,imagenUrl,pdfUrl);
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

const saveLibro = (name,autor,genero,paginas,imagenUrl,pdfUrl) => 
    db
    .collection('libros').doc().set({
        name,
        autor,
        genero,
        paginas,
        imagenUrl,
        pdfUrl
    });