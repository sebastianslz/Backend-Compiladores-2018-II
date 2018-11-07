/**
 * Iniciar sesion en la aplicacion
 */
exports.login = function(req, res){
    // Obtenemos los parametro
    var username = req.params.username;
    var password = req.params.password
    req.getConnection(function(err,connection){
        var query = connection.query('SELECT * FROM usuarios WHERE username = ? and password = ?',[username,password],function(err,rows){
            if(err)
                console.log("Error Selecting : %s ",err );
                res.send({data:rows[0]});
         });
    });
};

exports.registrarUsu = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function (err, connection) {
        var data = {
            cedula  : input.cedula,
            name    : input.nombre,
            apellido: input.apellido,
            telefono: input.telefono,
            direccion: input.direccion,
            fecha: input.fecha,
            rol: input.rol 
        };
        var query = connection.query("INSERT INTO customer set ? ",data, function(err, rows)
        {
          if (err)
                console.log("Error inserting : %s ",err );
                res.send('{"id": 505,"msj": "Se registro correctamente"}');
        });
        console.log(query.sql); //get raw query
    });
};

/**
 * Buscar usuario por persona
 */
exports.usuarioByPersona = function(req, res){
    var persona = req.params.persona;
    req.getConnection(function(err,connection){
        var query = connection.query('SELECT * FROM usuarios WHERE persona = ?',[persona],function(err,rows){
            if(err)
                console.log("Error Selecting : %s ",err );
                res.send({data:rows[0]});
         });
    });
};

/**
 * Lista de usuarios
 */
exports.listar = function(req, res){
    req.getConnection(function(err,connection){
          var query = connection.query('SELECT * FROM usuarios',function(err,rows){
                if(err)
                    console.log("Error Selecting : %s ",err );
                    res.send({data:rows});  
                    console.log(rows);
           });
      });
};

/**
 * Buscar persona por id
 */
exports.personaById = function(req, res){
    var id = req.params.id;
    req.getConnection(function(err,connection){
        var query = connection.query('SELECT * FROM personas WHERE id = ?',[id],function(err,rows){
            if(err)
                console.log("Error Selecting : %s ",err );
                res.send({data:rows[0]});
         });
    });
};

/**
 * Buscar persona por cedula
 */
exports.personaByCedula = function(req, res){
    var cedula = req.params.cedula;
    req.getConnection(function(err,connection){
        var query = connection.query('SELECT * FROM personas WHERE cedula = ?',cedula,function(err,rows){
            if(err)
                console.log("Error Selecting : %s ",err);
                res.send({data:rows[0]});
         });
    });
};

/**
 * 
 */
/**
 * Buscar persona por cedula con un determinado rol
 */
exports.personaByCedulaRol = function(req, res){
    var cedula = req.params.cedula;
    var rol = req.params.rol;
    req.getConnection(function(err,connection){
        var query = connection.query('SELECT * FROM personas WHERE cedula = ? AND rol = ?',[cedula, rol],function(err,rows){
            if(err)
                console.log("Error Selecting : %s ",err );
                res.send({data:rows[0]});
         });
    });
};

/**
 * Lista de personas
 */
exports.listarPersonas = function(req, res){
    req.getConnection(function(err,connection){
          var query = connection.query('SELECT * FROM personas',function(err,rows){
                if(err)
                    console.log("Error Selecting : %s ",err );
                    res.send({data:rows});  
           });
      });
};

/**
 * Lista de empleado
 */
exports.listarPersonasByRol = function(req, res){
    var idRol = req.params.rol;
    req.getConnection(function(err,connection){
          var query = connection.query('SELECT * FROM personas WHERE rol = ?',[idRol],function(err,rows){
                if(err)
                    console.log("Error Selecting : %s ",err );
                    res.send({data:rows});  
           });
      });
};
  
/**
 * Registrar una persona y su usuario
 */
exports.registrarPersona = function(req, res){
    var data = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err,connection){
        // Construimos el objeto persona que se va a registrar
        var persona = {
            cedula: data.persona.cedula,
            nombre: data.persona.nombre,
            apellido: data.persona.apellido,
            fecha_nacimiento: data.persona.fecha_nacimiento,
            telefono: data.persona.telefono,
            direccion: data.persona.direccion,
            rol: data.persona.rol.id,
        };
        // Validamos si ya existe una persona con el numero de cedula o telefono
        var sql = "SELECT * FROM personas WHERE cedula = ? OR telefono = ?";
        var validaPersona = connection.query(sql,[persona.cedula, persona.telefono], function(err, rows){
            // validamos si se presento error
            if(err){
                res.send({data:"Error al validar la persona"});
                return;
            }
            // validamos si se encuentro algun registro de persona
            if(rows.length > 0){
                res.send({data:"Ya hay una persona registrada con esta cedula y/o telefono"});
                return;
            }
            // Validamos si el usuario ya existe
            var sql2 = "SELECT * FROM usuarios WHERE username = ?";
            var validaUsuario = connection.query(sql2,[data.username], function(err, rows){
                // validamos si se presento error
                if(err){
                    res.send({data:"Error al validar el usuario"});
                    return;
                }
                // validamos si se encuentro algun registro de usuario
                if(rows.length > 0){
                    res.send({data:"El username '"+data.username+"' ya esta en uso"});
                    return;
                }
                // Guardamos la persona
                var queryPersona = connection.query("INSERT INTO personas set ? ",persona, function(err, rows){
                    if (err){
                        res.send({data:"Error al guardar la persona"});
                        console.log(persona);
                        console.log(err);
                        return;
                    }
                    // Buscamos la persona que se guardo
                    var buscarPersona = connection.query('SELECT * FROM personas WHERE cedula = ?',[persona.cedula],function(err,rows){
                        if(err){
                            res.send({data:"Error al buscar la persona guardada"});
                            return;
                        }
                        if(rows.length == 0){
                            res.send({data:"La persona guardada no se encontro"});
                            return;
                        }
                        // Obtenemos el id de la persona creada
                        var idPersonaBuscada = rows[0].id;
                        // Construimos el objeto usuario para registrarlo en la bd
                        var usuario = {
                            persona: idPersonaBuscada,
                            username: data.username,
                            password: data.password,
                        };
                        // Guardamos el usuario de la persona
                        var queryUsuario = connection.query("INSERT INTO usuarios set ? ",usuario, function(err, rows){
                            if (err){
                                res.send({data:"Error al guardar el usuario"});
                                return;    
                            }else{
                                res.send({data:"exito"});
                                return;    
                            }
                        });
                    });
                });
            });     
        });
    });
};

/**
 * editar una persona y su usuario
 */
exports.editarPersona = function(req, res){
    var data = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err,connection){
        // Construimos el objeto persona que se va a editar
        var persona = {
            cedula: data.persona.cedula,
            nombre: data.persona.nombre,
            apellido: data.persona.apellido,
            fecha_nacimiento: data.persona.fecha_nacimiento,
            telefono: data.persona.telefono,
            direccion: data.persona.direccion,
            rol: data.persona.rol.id,
        };
        // Construimos el objeto usuario para editar en la bd
        var usuario = {
            persona: data.persona.id,
            username: data.username,
            password: data.password,
        };
        // Validamos si ya existe una persona con el numero de cedula o telefono
        //  y que no sea la persona que se esta editando
        var sql = "SELECT * FROM personas WHERE (cedula = ? OR telefono = ?) AND id <> ?";
        var validaPersona = connection.query(sql,[persona.cedula, persona.telefono, usuario.persona], function(err, rows){
            // validamos si se presento error
            if(err){
                res.send({data:"Error al validar la persona"});
                return;
            }
            // validamos si se encuentro algun registro de persona
            if(rows.length > 0){
                res.send({data:"Otra persona tiene esta cedula y/o celular"});
                return;
            }
            // Validamos si el usuario ya existe, en caso de que vaya a cambiar de  username
            var sql2 = "SELECT * FROM usuarios WHERE username = ? AND persona <> ?";
            var validaUsuario = connection.query(sql2,[data.username,usuario.persona], function(err, rows){
                // validamos si se presento error
                if(err){
                    res.send({data:"Error al validar el usuario"});
                    return;
                }
                // validamos si se encuentro algun registro de usuario
                if(rows.length > 0){
                    res.send({data:"El username '"+data.username+"' ya esta en uso"});
                    return;
                }
                // Editamos la persona
                var queryPersona = connection.query("UPDATE personas set ? WHERE id = ?",[persona,usuario.persona], function(err, rows){
                    if (err){
                        res.send({data:"Error al editar la persona"});
                        return;
                    }
                    // Editamos el usuario de la persona
                    var queryUsuario = connection.query("UPDATE usuarios set ? WHERE persona = ?",[usuario,usuario.persona], function(err, rows){
                        if (err){
                            res.send({data:"Error al editar el usuario"});
                            return;    
                        }else{
                            res.send({data:"exito"});
                            return;    
                        }
                    });
                });
            });     
        });
    });
};