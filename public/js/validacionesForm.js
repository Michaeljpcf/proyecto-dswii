const inputs = document.querySelectorAll('.validForm input');

const expresiones = {
	name: /^[a-zA-ZÀ-ÿ\s]{3,50}$/,
	autor: /^[a-zA-ZÀ-ÿ\s]{3,50}$/,
	genero: /^[a-zA-ZÀ-ÿ\s,]{3,50}$/,
	paginas: /^[0-9]{1,10}$/
}

const campos = {
    name: false,
    autor: false,
    paginas: false,
    genero: false
}

const validFormInput = (e) => {
    switch (e.target.name) {
        case "name":
            validInput(expresiones.name, e.target, 'name');
            break;
        case "autor":
            validInput(expresiones.autor, e.target, 'autor');
            break;
        case "paginas":
            validInput(expresiones.paginas, e.target, 'paginas');
            break;
        case "genero":
            validInput(expresiones.genero, e.target, 'genero');
            break;
        case "nameU":
            validInput(expresiones.name, e.target, 'nameU');
            break;
        case "autorU":
            validInput(expresiones.autor, e.target, 'autorU');
            break;
        case "paginasU":
            validInput(expresiones.paginas, e.target, 'paginasU');
            break;
        case "generoU":
            validInput(expresiones.genero, e.target, 'generoU');
            break;
    }
}

const validInput = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo_${campo}`).classList.remove('formulario-grupo-incorrecto');
        document.getElementById(`grupo_${campo}`).classList.add('formulario-grupo-correcto');
        document.querySelector(`#grupo_${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo_${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo_${campo} .formulario-input-error`).classList.remove('formulario-input-error-activo');
        campos[campo] = true;
    } else {
        document.getElementById(`grupo_${campo}`).classList.add('formulario-grupo-incorrecto');
        document.getElementById(`grupo_${campo}`).classList.remove('formulario-grupo-correcto');
        document.querySelector(`#grupo_${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo_${campo} i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo_${campo} .formulario-input-error`).classList.add('formulario-input-error-activo');
        campos[campo] = false;
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', validFormInput);
    input.addEventListener('blur', validFormInput);
});