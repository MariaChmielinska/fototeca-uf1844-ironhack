// importar módulos de terceros
const express = require('express');
const morgan = require('morgan');

// creamos una instancia del servidor Express
const app = express();

// Tenemos que usar un nuevo middleware para indicar a Express que queremos procesar peticiones de tipo POST
app.use(express.urlencoded({ extended: true }));

// Añadimos el middleware necesario para que el client puedo hacer peticiones GET a los recursos públicos de la carpeta 'public'
app.use(express.static('public'));

// Base de datos de imágenes
const images = [];

// Especificar a Express que quiero usar EJS como motor de plantillas
app.set('view engine', 'ejs');

// Usamos el middleware morgan para loguear las peticiones del cliente
app.use(morgan('tiny'));

// Cuando nos hagan una petición GET a '/' renderizamos la home.ejs
app.get('/', (req, res) => {

    // 2. Usar en el home.ejs el forEach para iterar por todas las imágenes de la variable 'images'. Mostrar de momento solo el título 
    res.render('home', {
        images
    });
});

// Cuando nos hagan una petición GET a '/add-image-form' renderizamos 
app.get('/add-image-form', (req, res) => {
    res.render('form', {
        isImagePosted: undefined,
        errorMessage: undefined
    });
});

// Cuando nos hagan una petición POST a '/add-image-form' tenemos que recibir los datos del formulario y actualizar nuestra "base de datos"
app.post('/add-image-form', (req, res) => {
    // todos los datos vienen en req.body
    console.log('REQUEST: ', req.body);
    
    // 1. Actualizar el array 'images' con la información de req.body
    const { title, url } = req.body;

    // opción 1: totalmente válida
    //images.push(req.body); // [{title: 'Gato'}]

    // otra opción, 'sacar' los campos
    // images.push({
    //     title
    // })

    console.log('array de imagenes actualizado: ', images);

    // 3. Añadir los otros campos del formulario y sus validaciones

    const titlePattern = /^[a-zA-Z0-9_]+$/;
    const urlPattern =  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!titlePattern.test(title)) {
        // Render the form with an error message
        return res.render('form', {
            isImagePosted: false,
            errorMessage: 'Invalid title. Only letters, numbers, and underscores are allowed.'
        });
    }

    if (!urlPattern.test(url)){

        return res.render('form',{
            isImagePosted: false,
            errorMessage: 'Invalid URL. Please enter a valid URL'
        });
    }
    

     images.push({
        title,
        url
    })  
      

    // 4julio: Tras insertar una imagen 'dejaremos' el formulario visible 
    //res.send('Datos recibidos');
    // Redirect es un método del objecto Response que permite 'redirigir' al cliente a un nuevo endpoint o vista
    res.render('form', {
        isImagePosted: true,
        errorMessage: undefined
    });
});


// en el futuro es normal que tengamos endpoints como
// app.get('/edit-image-form')

app.listen(3000, (req, res) => {
    console.log("Servidor escuchando correctamente en el puerto 3000.")
});
