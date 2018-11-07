
/**
 * Module dependencies.
 */

var express = require('express');
var servicios = require('./servicios');
var http = require('http');
var path = require('path');

// --------- SERVICIOS ------------ //

// servicios de usuario
var usuarioServicio = require('./servicios/UsuarioServicio')
// servicios de rol y acessos
var rolServicio = require('./servicios/RolServicio')
// servicios de inmuebles
var inmublesServicio = require('./servicios/InmublesServicio')
// servicios genericos
var genericoServicio = require('./servicios/genericoServicio')

// -------------END --------------- //

var app = express();
var connection  = require('express-myconnection'); 
var mysql = require('mysql');
// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Permitimos acceso desde el cliente 4200 y al Karma 9876
 */
app.use(function (req, res, next) {
    /**
     * Lista de dominios permitidos
     */
    var allowedOrigins = ['http://localhost:4200', 'http://localhost:9876'];
    // obtenemos el origin
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        // permitimos el acceso del origin, siempre y cuando este en el array allowedOrigins
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/

app.use(
    connection(mysql,{
        
        host: 'localhost', //'localhost',
        user: 'root',
        password : '1234',
        port : 3306, //port mysql
        database:'marelsa'

    },'pool') //or single
);

app.get('/', servicios.index);
// ------- Rutas para los Servicios de Usuario -------- //
app.get('/usuarios/login/:username/:password', usuarioServicio.login);
app.get('/usuarios/usuario-by-persona/:persona', usuarioServicio.usuarioByPersona);
app.get('/usuarios/listar', usuarioServicio.listar);
// ------- Rutas para los Servicios de persona -------- //
app.get('/personas/persona-by-id/:id', usuarioServicio.personaById);
app.get('/personas/persona-by-cedula/:cedula', usuarioServicio.personaByCedula);
app.get('/personas/persona-by-cedula-rol/:cedula/:rol', usuarioServicio.personaByCedulaRol);
app.get('/personas/listar', usuarioServicio.listarPersonas);
app.get('/personas/listar-by-rol/:rol', usuarioServicio.listarPersonasByRol);
app.post('/personas/registrar', usuarioServicio.registrarPersona);
app.post('/personas/editar', usuarioServicio.editarPersona);
// ------- Rutas para los Servicios de Rol y Accesos -------- //
app.get('/rol/listar', rolServicio.listar);
app.get('/rol-accesos/listar', rolServicio.ListarRolAccesos);
app.get('/rol/rol-by-id/:id', rolServicio.rolById);
app.get('/rol/rol-by-persona/:id', rolServicio.rolByPersona);
app.get('/acceso/listar', rolServicio.listarAccesos);
app.get('/acceso/por-rol/:rol', rolServicio.accesosPorRol);
// ------- Rutas para los Servicios de inmuebles -------- //
app.post('/inmueble/registrar', inmublesServicio.registrarInmueble);
app.get('/inmueble/buscar', inmublesServicio.buscarInmueble);
app.post('/inmueble/editar', inmublesServicio.editarInmueble);
app.get('/inmueble/listarCiudades', inmublesServicio.listarCiudades);
app.get('/inmueble/listarTipos', inmublesServicio.listarTipoInmuebles);
//------------------ Servicios Genericos -------------------- //
app.post('/generico/listar', genericoServicio.listar);
app.post('/generico/guardar', genericoServicio.guardar);
app.post('/generico/editar', genericoServicio.editar);
app.post('/generico/buscar', genericoServicio.buscar);
app.post('/generico/eliminar', genericoServicio.eliminar);
// ------------ END -----------------------------------//

app.use(app.router);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
