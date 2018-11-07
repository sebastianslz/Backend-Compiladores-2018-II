/**
 * Registrar un inmueble
 */
exports.registrarInmueble = function(req, res) {
    var data = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err,connection){
        // Construimos el objeto inmueble que se va a registrar
        var usu = {
            cedula: data.Usuario.Persona.cedula
        };
        
        var sql = "SELECT * FROM personas WHERE cedula = ?";
        connection.query(sql,usu.cedula, function(err, rows) {
            console.log(usu.cedula)
            if(err){
                res.send({data:"Error al buscar la persona guardada"});
                return;
            }
            if(rows.length == 0){
                res.send({data:"La persona guardada no se encontro"});
                return;
            }
            var idPersonaBuscada = rows[0].id;

            var inmueble = {
                numero_matricula: data.matricula,
                direccion: data.direccion,
                area: data.area,
                valor: data.valor,
                banios: data.banios,
                estado: data.estado,
                tipoVentaArrendo: data.tipoAV,
                garajes: data.garajes,
                antiguedad: data.antiguedad,
                detalles: data.detalles,
                añoConstruccion: data.anioContruccion,
                ascensor: data.ascensor,
                canchas_deportivas: data.canchasDepor,
                zonas_humedas: data.zonasHumedas,
                zona_infantil: data.zonaInfantil,
                jardines: data.jardines,
                transporte_publico_cercano: data.transporteCercano,
                precio_negociable: data.precioNegociable,
                zona_ropas: data.zonasRopas,
                parqueadero: data.parqueadero,
                deposito: data.deposito,
                estudio: data.estudio,
                tipo_cortinas: data.tipoCortinas,
                cuarto_servicio: data.cuartoServicio,
                chimenea: data.chimenea,
                cocinaAbiertaCerrada: data.cocinaAC,
                comedorIndependiente: data.comedorIndependiente,
                vista_exterior_interior: data.vistaExterios,
                zona: data.zona,
                Tipo: data.Tipo.id,
                Ciudad: data.Ciudad.id,
                Usuario: idPersonaBuscada
            };

            var sql2 = "SELECT * FROM inmuebles WHERE numero_matricula = ?";
            connection.query(sql2,inmueble.numero_matricula, function(err, rows){
                if(rows.length > 0){
                    res.send({data:"el inmueble ya se encuentra registrado"});
                    return;
                }
                var sql3 = "INSERT INTO inmobiliaria set = ?";
                connection.query(sql3,inmueble, function(err, rows){
                    if (err){
                        res.send({data:"Error al guardar el usuario"});
                        return;    
                    }else{
                        res.send({data:"exito"});
                        return;    
                    }
                })
            })
        });
    });
};

/**
 * Buscar inmueble por matricula
 */
exports.buscarInmueble = function(req, res){
    var matricula = req.params.matricula;
    console.log('LOG: ' + matricula);
    req.getConnection(function(err,connection){
        connection.query('SELECT * FROM inmueble WHERE numero_matricula = ?',[matricula],function(err,rows){
            if(err)
                console.log("Error Selecting : %s ",err );
                res.send({data:rows[0]});
         });
    });
};

/**
 * 
 * Edita el inmueble
 */
exports.editarInmueble = function(err, res){
    var data = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err,connection){
        var inmueble = {
            numero_matricula: data.matricula,
            direccion: data.direccion,
            area: data.area,
            valor: data.valor,
            banios: data.banios,
            estado: data.estado,
            tipoVentaArrendo: data.tipoAV,
            garajes: data.garajes,
            antiguedad: data.antiguedad,
            detalles: data.detalles,
            añoConstruccion: data.anioContruccion,
            ascensor: data.ascensor,
            canchas_deportivas: data.canchasDepor,
            zonas_humedas: data.zonasHumedas,
            zona_infantil: data.zonaInfantil,
            jardines: data.jardines,
            transporte_publico_cercano: data.transporteCercano,
            precio_negociable: data.precioNegociable,
            zona_ropas: data.zonasRopas,
            parqueadero: data.parqueadero,
            deposito: data.deposito,
            estudio: data.estudio,
            tipo_cortinas: data.tipoCortinas,
            cuarto_servicio: data.cuartoServicio,
            chimenea: data.chimenea,
            cocinaAbiertaCerrada: data.cocinaAC,
            comedorIndependiente: data.comedorIndependiente,
            vista_exterior_interior: data.vistaExterios,
            zona: data.zona,
            aprobacion_fecha: data.fechaAprobacion
        }
        var sql = "UPDATE inmuebles set ? WHERE persona = ?";
        connection.query(sql,inmueble, function(err, rows){
            if (err){
                res.send({data:"Error al editar el inmueble"});
                return;    
            }else{
                res.send({data:"exito"});
                return;    
            }
        });
    });
}

/**
 * Lista de ciudades
 */
exports.listarCiudades = function(req, res){
    req.getConnection(function(err,connection){
          connection.query('SELECT * FROM ciudades', function(err,rows){
                if(err)
                    console.log("Error Selecting : %s ",err );
                    res.send({data:rows});  
           });
      });
};

/**
 * Lista de ciudades
 */
exports.listarTipoInmuebles = function(req, res){
    req.getConnection(function(err,connection){
          connection.query('SELECT * FROM inmobiliaria.TIPO_INMUEBLE', function(err,rows){
                if(err)
                    console.log("Error Selecting : %s ",err );
                    res.send({data:rows});  
           });
      });
};