
/**
 * Lista de una tabla determinada
 */
exports.listar = function(req, res){
      // Objetenmos los datos enviados desde el cliente
      var data = JSON.parse(JSON.stringify(req.body));
      // Tabla donde va a ir a consultar
      var tabla = data.tabla;
      // Objeto con los parametros a filtrar
      var parametros = data.objeto;
      // La consulta a ejecutar
      var sql = "SELECT * FROM "+tabla;
      if(parametros != null){
        sql += " WHERE ";
        var sum = 0;
        // cantidad de parametros en el objeto
        var size = Object.keys(parametros).length;
        for (var key in parametros) {
            if(sum != 0 && sum != size){
                  sql += " AND ";
            }
            sql += key+" = "+parametros[key];
            sum++;
        }
      }
      // Imprimimos en consola la peticion y el origen
      indicaOrigin(req,sql);
      // Ejecutamos la consulta y retornamos
      req.getConnection(function(err,connection){
            var query = connection.query(sql,function(err,rows){
                if(err){
                    res.send({data:err.code});
                    console.log("Error Selecting : %s ",err );
                }else{
                    res.send({data:rows});
                }
             });
        });
  };
  
  /**
   * Guardar en una tabla determinada
   */
  exports.guardar = function(req, res){
        // Objetenmos los datos enviados desde el cliente
        var data = JSON.parse(JSON.stringify(req.body));
        // Tabla donde va a ir a guardar
        var tabla = data.tabla;
        // El Objeto enviado desde el cliente
        var elObjeto = data.objeto;
        // Construimos el objeto a guardar
        var objeto = {};
        // Llenamos el objeto con los datos de elObjeto
        for (var key in elObjeto) {
              // Validamos si el atributo es un objeto
              if(typeof elObjeto[key] === "object"){
                    // Como es un objeto, solo obtenemos el id para la foranea
                    objeto[key] = obtenerId(elObjeto[key]);
              }else{
                    objeto[key] = elObjeto[key];
              }
        }
        console.log(data);
        console.log(tabla);
        console.log(elObjeto);
        console.log(objeto);
        // La consulta a ejecutar
        var sql = "INSERT INTO "+tabla+" set ? ";
        // Imprimimos en consola la peticion y el origen
        indicaOrigin(req,sql);
        // Ejecutamos  la consulta y retornamos
        req.getConnection(function(err,connection){
              connection.query(sql,objeto,function(err,rows){
                  if(err){
                    res.send({data:"no se pudo guardar, intente de nuevo. "+err.code});
                    console.log(err);
                  }else{
                    // Retornamos exito en la operacion y el id asignado al registro guardado
                    res.send({data:"exito", id:rows.insertId});
                  }
              });
        });
  };
  
  /**
   * Editar en una tabla determinada
   */
  exports.editar = function(req, res){
        // Objetenmos los datos enviados desde el cliente
        var data = JSON.parse(JSON.stringify(req.body));
        // Tabla donde va a ir a editar
        var tabla = data.tabla;
        // nombre de la pk del registro a editar
        var pk = data.pk;
        // El Objeto enviado desde el cliente
        var elObjeto = data.objeto;
        // Construimos el objeto a editar
        var objeto = {};
        // Llenamos el objeto con los datos de elObjeto
        for (var key in elObjeto) {
              // Validamos si el atributo es un objeto
              if(typeof elObjeto[key] === "object"){
                    // Como es un objeto, solo obtenemos el id para la foranea
                    objeto[key] = obtenerId(elObjeto[key]);
              }else{
                    objeto[key] = elObjeto[key];
              }
        }
        // La consulta a ejecutar
        var sql = "UPDATE "+tabla+" set ? WHERE "+pk+" = ?";
        // Imprimimos en consola la peticion y el origen
        indicaOrigin(req,sql);
        // Ejecutamos la consulta y retornamos
        req.getConnection(function(err,connection){
              var query = connection.query(sql,[objeto,objeto[pk]],function(err,rows){
                  if(err){
                    res.send({data:"no se pudo editar, intente de nuevo. "+err.code});
                  }else{
                    // Devolvemos exito y el id del registro que se edito
                    res.send({data:"exito", id:rows.insertId});
                  }
              });
        });
  };
  
  /**
   * Busca de una tabla determinada
   */
  exports.buscar = function(req, res){
        // Objetenmos los datos enviados desde el cliente
        var data = JSON.parse(JSON.stringify(req.body));
        // Tabla donde va a ir a consultar
        var tabla = data.tabla;
        // Objeto con los parametros a filtrar
        var parametros = data.objeto;
        // La consulta a ejecutar
        var sql = "SELECT * FROM "+tabla;
        if(parametros != null){
          sql += " WHERE ";
          var sum = 0;
          // cantidad de parametros en el objeto
          var size = Object.keys(parametros).length;
          for (var key in parametros) {
              if(sum != 0 && sum != size){
                    sql += " AND ";
              }
              sql += key+" = "+parametros[key];
              sum++;
          }
        }
        // Imprimimos en consola la peticion y el origen
        indicaOrigin(req,sql);
        // Ejecutamos la consulta y retornamos
        req.getConnection(function(err,connection){
              var query = connection.query(sql,function(err,rows){
                    if(err){
                          res.send({data:err.code});
                    }else{
                          res.send({data:rows[0]});
                    }
              });
          });
  };
  
  /**
   * Eliminar registro de una tabla determinada
   */
  exports.eliminar = function(req, res){
        // Objetenmos los datos enviados desde el cliente
        var data = JSON.parse(JSON.stringify(req.body));
        // Tabla donde va a ir a consultar
        var tabla = data.tabla;
        // objeto que contiene el nombre del atributo y el valor del registro a eliminar
        var objeto = data.objeto;
        // la pk del registro
        var pk = Object.keys(objeto)[0];
        // La consulta a ejecutar
        var sql = "DELETE FROM "+tabla+" WHERE "+pk+" = ?";
        // Imprimimos en consola la peticion y el origen
        indicaOrigin(req,sql);
        // Ejecutamos la consulta y retornamos
        req.getConnection(function(err,connection){
              var query = connection.query(sql,objeto[pk],function(err,rows){
                    if(err){
                          res.send({data:err.code});
                    }else{
                          res.send({data:"exito"});
                    }
              });
        });
  };
  
  /**
   * obtiene el id de un objeto foranea
   */
  function obtenerId(objeto){
        // el id del objeto primario
        var id;
        for (var key in objeto) {
              // Validamos si es un objeto
              if(typeof objeto[key] === "object"){
                    for (var key2 in objeto[key]) {
                          if(key2 == "id" || key2 == "persona" || key2 == "inmueble" || key2 == "cliente" || key2 == "empleado"){
                                id = objeto[key][key2];
                          }
                    }
              }else{
                    // Validamos si el atributo es un objeto
                    if(key == "id" || key == "persona" || key == "inmueble" || key2 == "cliente" || key2 == "empleado"){
                          id = objeto[key];
                    }
              }
        }
        return id;
  }
  
  /**
   * Nos indica el origen de la peticion al servicio
   */
  function indicaOrigin(req,sql){
        console.log("Origen: "+req.headers.origin+" - Peticion: "+sql);
  }
  
  /**
   * cargar archivos
   */
  exports.cargarArchivo = function(req, res){      
        // Objetenmos los datos enviados desde el cliente
        console.log("parametros: "+req.params.lang);
        // Nombre del archivo a guardar, usamos date para asignar un nombre unico
        var name = "archivo"+new Date().getTime();
        res.send({data:"exito", nombreArchivo:name});
  }