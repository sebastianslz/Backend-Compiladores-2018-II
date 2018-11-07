/**
 * Lista de roles
 */
exports.listar = function(req, res){
    req.getConnection(function(err,connection){
          var query = connection.query('SELECT * FROM roles',function(err,rows){
              if(err)
                    console.log("Error Selecting : %s ",err );
                    res.send({data:rows});  
                    console.log(rows);
           });
      });
};

/**
 * Buscar rol por id
 */
exports.rolById = function(req, res){
      var id = req.params.id;
      req.getConnection(function(err,connection){
          var query = connection.query('SELECT * FROM roles WHERE id = ?',[id],function(err,rows){
              if(err)
                  console.log("Error Selecting : %s ",err );
                  res.send({data:rows[0]});
           });
      });
  };

/**
 * Buscar el rol de una persona por el id de la persona
 */
exports.rolByPersona = function(req, res){
      var id = req.params.id;
      req.getConnection(function(err,connection){
          var query = connection.query('SELECT r.* FROM roles r JOIN personas p ON p.rol = r.id WHERE p.id = ?',[id],function(err,rows){
              if(err)
                  console.log("Error Selecting : %s ",err );
                  res.send({data:rows[0]});
           });
      });
};

/**
 * Lista de Accesos
 */
exports.listarAccesos = function(req, res){
    req.getConnection(function(err,connection){
          var query = connection.query('SELECT * FROM accesos',function(err,rows){
              if(err)
                    console.log("Error Selecting : %s ",err );
                    res.send({data:rows});  
                    console.log(rows);
           });
      });
};

/**
 * Lista de Rol Accesos
 */
exports.ListarRolAccesos = function(req, res){
    req.getConnection(function(err,connection){
          var query = connection.query('SELECT * FROM rol_accesos',function(err,rows){
              if(err)
                    console.log("Error Selecting : %s ",err );
                    res.send({data:rows});  
                    console.log(rows);
           });
      });
};

/**
 * Lista de Accesos por Rol
 */
exports.accesosPorRol = function(req, res){
    // Obtenemos los parametro
    var rol = req.params.rol;
    req.getConnection(function(err,connection){
          var query = connection.query('SELECT a.* FROM rol_accesos ra JOIN accesos a ON a.id = ra.acceso WHERE rol = ?',[rol],function(err,rows){
              if(err)
                    console.log("Error Selecting : %s ",err );
                    res.send({data:rows});  
                    console.log(rows);
           });
      });
};