
/*
 * GET users listing.
 */

exports.list = function(req, res){

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM customer',function(err,rows)
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
       
        var query = connection.query('SELECT * FROM customer WHERE id = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.send({data:rows[0]});
                
           
         });
         
         //console.log(query.sql);
    }); 
};

/*Save the customer*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            name    : input.name,
            address : input.address,
            email   : input.email,
            phone   : input.phone 
        
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

exports.save_edit = function(req,res){
    
    console.log(req.body);
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            name    : input.name,
            address : input.address,
            email   : input.email,
            phone   : input.phone 
        
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


exports.delete_customer = function(req,res){
          
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM customer  WHERE id = ? ",[id], function(err, rows)
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
        
        var customer = {
            
            name    : input.name,
            address : input.address,
            email   : input.email,
            phone   : input.phone,
            username : input.login.username
        
        };

        var login = {
            
            username    : input.login.username,
            contraseña : input.login.contraseña
        
        };
        console.log(login);
        
        var query = connection.query("INSERT INTO login set ? ",login, function(err, rows)
        {
            if (err)
            console.log("Error inserting : %s ",err );
       
        //res.send('{"id": 505,"msj": "Se registro correctamente"}');
        
      });

        var query2 = connection.query("INSERT INTO customer set ? ",customer, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.send('{"id": 505,"msj": "Se registro correctamente customer"}');
          
        });
        
        console.log(query.sql); //get raw query
    
    });
};