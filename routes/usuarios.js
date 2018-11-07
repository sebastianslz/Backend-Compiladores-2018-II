
/*
 * GET users listing.
 */

exports.list = function(req, res){

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM usuario',function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send({data:rows});
                
           
         });
         
         //console.log(query.sql);
    });
  
};

exports.search = function(req, res){
    
    var id = req.params.id;
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM usuario WHERE cedula = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send({data:rows[0]});
                
           
         });
         
         //console.log(query.sql);
    }); 
};

exports.edit = function(req,res){
    
    console.log(req.body);
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            nombre    : input.nombre,
            apellido : input.apellido,
            email   : input.email,
        
        };
        
        connection.query("UPDATE customer set ? WHERE id = ? ",[data,input.id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         res.send('Se edito correctamente');
         // res.redirect('/customers');
          
        });
    
    });
};


exports.delete_usuario = function(req,res){
          
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM usuario  WHERE id = ? ",[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
                 res.send('{"id": 505,"msj": "Se elimino correctamente"}');
             
        });
        
     });
};

/*Save the login customer*/
exports.savelogin = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
console.log(input);

    req.getConnection(function (err, connection) {
        
        var usuario = {
            
            cedula : input.cedula,
            nombre    : input.nombre,
            apellido : input.apellido,
            email   : input.email,
            username : input.login.username
        
        };

        var login = {
            
            username    : input.login.username,
            contrasenia : input.login.contrasenia
        
        };
        console.log(login);
        
        var query = connection.query("INSERT INTO login set ? ",login, function(err, rows)
        {
            if (err)
            console.log("Error inserting : %s ",err );
       
        //res.send('{"id": 505,"msj": "Se registro correctamente"}');
        
      });

        var query2 = connection.query("INSERT INTO usuario set ? ",usuario, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.send('{"id": 505,"msj": "Se registro correctamente customer"}');
          
        });
        
        console.log(query.sql); //get raw query
    
    });
};