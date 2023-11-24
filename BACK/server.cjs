const express = require('express');
const cors = require('cors');
const mysql = require('mysql2'); // Importa la biblioteca mysql2
const { json } = require('body-parser');
const app = express();
const port = 3300;
const jwt = require('jsonwebtoken');


// Configura la conexión a la base de datos
const db = mysql.createConnection({
  host: '127.0.0.1', // Reemplaza con el nombre de tu servidor de base de datos
  user: 'root', // Reemplaza con tu nombre de usuario de la base de datos
  password: '', // Reemplaza con tu contraseña
  database: 'unite_bd', // Reemplaza con el nombre de tu base de datos
  port: 3306,
});

db.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw error;
  } else {
    console.log('Conexión a la base de datos exitosa');
  }
});

// Obtener la clave secreta desde config.json

const fs = require('fs');
// Lee el archivo de configuración
const configFile = fs.readFileSync('config.json', 'utf8');
// Parsea el contenido como JSON
const config = JSON.parse(configFile)
// Accede a la clave secreta y otras configuraciones
const secretKey = config.secretKey;
console.log("Valor de la variable SECRET_KEY:", secretKey);

// Continúa con la configuración de tus rutas y API

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));



// Ruta para registro de usuario con verificación de correo

app.post('/register', (req, res) => {
  const { rut, nombres, apellidos, edad, genero, celular, correo, contrasena, direccion, tipoUsuario, comuna} = req.body;

  // Verificar si el correo ya está registrado en la base de datos
  db.query('SELECT * FROM usuario WHERE correo = ?', [correo], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).json({ error: 'Error en la consulta' });
    } else if (results.length > 0) {
      res.status(400).json({ error: 'El correo ingresado ya está registrado' });
    } else {
      // Si el correo no está registrado, procede con el registro del nuevo usuario
      const query = 'INSERT INTO usuario (rut, nombres, apellidos, edad, genero, celular, correo, contrasena, direccion, fk_tipo_usuario, fk_comuna) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [rut, nombres, apellidos, edad, genero, celular, correo, contrasena, direccion, tipoUsuario, comuna];

      db.query(query, values, (error, results) => {
        if (error) {
          console.error('Error al registrar usuario:', error);
          res.status(500).json({ error: 'Error al registrar usuario' });
        } else {
          console.log('Usuario registrado con éxito');
          res.status(200).json({ message: 'Usuario registrado con éxito', usuario:results });
        }
      });
    }
  });
});

//Consulta Validador Usuario y generador de Token

app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  // Realiza una consulta a la base de datos para verificar las credenciales
  db.query('SELECT * FROM usuario WHERE correo = ?', [correo], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      res.status(500).json({ error: 'Error en la consulta' });
    } else if (results.length === 0) {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    } else {
      const userData = results[0];

      const infoUsuario ={
        cod_user: userData.cod_usuario,
      };
      // Compara la contraseña ingresada directamente con la contraseña en la base de datos
      if (contrasena !== userData.contrasena) {
        res.status(401).json({ error: 'Credenciales incorrectas' });
      } else {
        // Genera un token JWT y lo envía como respuesta
        const token = jwt.sign(infoUsuario, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token, infoUsuario});
        console.log('Inicio de sesion exitoso, token generado con exito')
      }
    }
  });
});


//Ruta de obtencion de Usuario a traves de token
app.get('/ObtenerUsuario', (req, res) => {
  // Middleware de autenticación: verifica si el token es válido
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Acceso no autorizado' });
    }
    // El token es válido, extrae el cod_usuario del payload
    const codUsuario = decoded.cod_user

    // El token es válido, busca los datos del usuario en la base de datos
    db.query('SELECT * FROM usuario WHERE cod_usuario = ?', [codUsuario], (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error en la consulta' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        // Devuelve los datos del usuario
        const informacion = results[0];

      const datosUsuario ={
        cod_user: informacion.cod_usuario,
        nombres: informacion.nombres,
        apellidos: informacion.apellidos,
        edad: informacion.edad,
        genero: informacion.genero,
        celular: informacion.celular,
        correo: informacion.correo,
        direccion: informacion.direccion,
        comuna: informacion.fk_comuna,
        tipo_usuario: informacion.fk_tipo_usuario
      };
        console.log('info: ', datosUsuario)
        res.status(200).json(datosUsuario);
      }
    });
  });
});

//Consulta para crear eventos
app.post('/api/crear-eventos', (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { nombre, fecha, hora, direccion, requisitos, descripcion, limite_usuarios, codUsuario, codComuna, codCategoria } = req.body;
  console.log('Valores desestructurados:', { nombre, fecha, hora, direccion, requisitos, descripcion, limite_usuarios, codUsuario, codComuna, codCategoria });
  const query = 'INSERT INTO evento (nombre, fecha_ini, hora_ini, direccion, requisitos, descripcion, cant_asistentes, fk_usuario, fk_comuna, fk_categoria) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [nombre, fecha, hora, direccion, requisitos, descripcion, limite_usuarios, codUsuario, codComuna, codCategoria];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error al crear el evento:', error);
      res.status(500).json({ mensaje: 'Error al crear el evento' });
    } else {
      console.log('Evento creado con éxito');
      res.json({ mensaje: 'Evento creado con éxito', evento: results });
    }
  });
});

// Ruta para buscar eventos
app.get('/api/buscar-eventos', (req, res) => {
  const { searchTerm, cod_usuario } = req.query;

  // Realiza la consulta a la base de datos para buscar eventos que coincidan con el término de búsqueda
  const query = `
    SELECT evento.*, categoria.categoria AS nombre_categoria,
      COUNT(solicitud.fk_evento) AS solicitud_realizada
    FROM evento
    JOIN categoria ON evento.fk_categoria = categoria.cod_categoria
    LEFT JOIN solicitud 
      ON evento.cod_evento = solicitud.fk_evento 
      AND solicitud.fk_usuario = ?
    WHERE (evento.nombre LIKE ? OR categoria.categoria LIKE ?)
      AND (solicitud.fk_evento IS NULL OR solicitud.fk_usuario IS NULL)
    GROUP BY evento.cod_evento
  `;

  const searchValue = `%${searchTerm}%`;

  db.query(query, [cod_usuario, searchValue, searchValue], (err, results) => {
    if (err) {
      console.error('Error al buscar eventos:', err);
      res.status(500).json({ error: 'Error al buscar eventos' });
    } else {
      res.status(200).json({ eventos: results });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});


// Ruta para obtener detalles de un evento específico
app.get('/api/detalles-evento/:eventId', (req, res) => {
  const eventId = req.params.eventId;

  // Realiza una consulta para obtener los detalles del evento con el ID especificado
  const query = 
  
  
  `
    SELECT evento.*, categoria.categoria AS nombre_categoria
    FROM evento
    JOIN categoria ON evento.fk_categoria = categoria.cod_categoria
    WHERE evento.cod_evento = ?
  `;

  db.query(query, [eventId], (err, results) => {
    if (err) {
      console.error('Error en la consulta de detalles del evento:', err);
      res.status(500).json({ mensaje: 'Error en la consulta de detalles del evento' });
    } else {
      if (results.length === 0) {
        // No se encontraron detalles del evento
        res.status(404).json({ mensaje: 'No se encontraron detalles del evento' });
      } else {
        // Devuelve los detalles del evento con la información de la categoría
        const evento = results[0];
        const { nombre_categoria, ...restoEvento } = evento;
        res.json({ evento: { ...restoEvento, categoria: nombre_categoria } });
      }
    }
  });
});

app.get('/comunas', (req, res) => {
  console.log('Recibida solicitud para obtener comunas');
  // Consulta la base de datos o realiza la lógica necesaria para obtener las comunas
  db.query('SELECT * FROM comuna', (err, result) => {
    if (err) {
      console.error('Error en la consulta de comunas:', err);
      res.status(500).json({ error: 'Error en la consulta de comunas' });
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/categorias', (req, res) => {
  console.log('Recibida solicitud para obtener categorias');
  // Consulta la base de datos o realiza la lógica necesaria para obtener las comunas
  db.query('SELECT * FROM categoria', (err, result) => {
    if (err) {
      console.error('Error en la consulta de categorias:', err);
      res.status(500).json({ error: 'Error en la consulta de categorias' });
    } else {
      res.status(200).json(result);
    }
  });
});





// Ruta para obtener mis eventos
app.get('/api/mis-eventos', async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  jwt.verify(token.split(' ')[1], secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Acceso no autorizado' });
    }

    const codUsuario = decoded.cod_user;

    const query = `
      SELECT evento.*, categoria.categoria AS nombre_categoria
      FROM evento
      JOIN categoria ON evento.fk_categoria = categoria.cod_categoria
      WHERE evento.fk_usuario = ? OR evento.cod_evento IN (
        SELECT participacion.fk_evento
        FROM participacion
        WHERE participacion.fk_usuario = ?
      )
    `;

    try {
      const results = await db.promise().query(query, [codUsuario, codUsuario]);
      const eventos = results[0]; // Cambio: obtener los resultados de la consulta
    
      if (eventos && eventos.length > 0) { // Cambio: verificar si hay eventos
        console.log("Eventos recibidos:", eventos);
        res.status(200).json({ eventos }); // Cambio: enviar eventos en la respuesta JSON
      } else {
        console.log("No se encontraron eventos");
        res.status(200).json({ eventos: [] }); // Cambio: enviar una matriz vacía si no hay eventos
      }
    
    } catch (error) {
      console.error('Error al obtener eventos anclados al usuario:', error);
      res.status(500).json({ error: 'Error al obtener eventos anclados al usuario' });
    }
    
  });
});


// Ruta para obtener detalles de un evento específico para el usuario organizador
app.get('/api/detalles-evento-organizador/:eventId', (req, res) => {
  const eventId = req.params.eventId;

  // Middleware de autenticación: verifica si el token es válido
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Acceso no autorizado' });
    }

    // El token es válido, extrae el cod_usuario del payload
    const codUsuario = decoded.cod_user;

    // Realiza una consulta para verificar si el usuario es el organizador del evento
    const queryEvento = `
      SELECT
        evento.*,
        categoria.categoria AS nombre_categoria,
        usuario.nombres AS nombre_organizador,
        comuna.comuna AS nombre_comuna,
        rol.nombre AS nombre_rol,
        rol.descripcion AS descripcion_rol
      FROM evento
      JOIN categoria ON evento.fk_categoria = categoria.cod_categoria
      JOIN usuario ON evento.fk_usuario = usuario.cod_usuario
      JOIN comuna ON evento.fk_comuna = comuna.cod_comuna
      LEFT JOIN rol ON evento.cod_evento = rol.fk_evento
      WHERE evento.cod_evento = ? AND evento.fk_usuario = ?
    `;

    db.query(queryEvento, [eventId, codUsuario], (errEvento, resultsEvento) => {
      if (errEvento) {
        console.error('Error en la consulta de detalles del evento:', errEvento);
        res.status(500).json({ mensaje: 'Error en la consulta de detalles del evento' });
      } else {
        if (resultsEvento.length === 0) {
          // El usuario no es el organizador del evento
          res.status(403).json({ mensaje: 'No tienes permisos para ver estos detalles del evento' });
        } else {
          // El usuario es el organizador del evento, obtén los detalles
          const evento = resultsEvento[0];
          const { nombre_categoria, nombre_comuna, ...restoEvento } = evento;
    
          // Agrupa roles asociados al evento
          const roles = resultsEvento
            .filter((result) => result.nombre_rol && result.descripcion_rol)
            .map((result) => ({ nombre: result.nombre_rol, descripcion: result.descripcion_rol }));
    
          res.json({ evento: { ...restoEvento, categoria: nombre_categoria, comuna: nombre_comuna, roles } });
        }
      }
    });
  });
});




// Agrega esta nueva ruta para la edición de eventos
app.put('/api/editar-evento/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const {
    nombre,
    fecha,
    hora,
    direccion,
    requisitos,
    descripcion,
    limite_usuarios,
    codCategoria,
  } = req.body;

  const query = `
    UPDATE evento
    SET
      nombre = ?,
      fecha_ini = ?,
      hora_ini = ?,
      direccion = ?,
      requisitos = ?,
      descripcion = ?,
      cant_asistentes = ?,
      fk_categoria = ?
    WHERE cod_evento = ?
  `;

  const values = [
    nombre,
    fecha,
    hora,
    direccion,
    requisitos,
    descripcion,
    limite_usuarios,
    codCategoria,
    eventId,
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error al editar el evento:', error);
      res.status(500).json({ mensaje: 'Error al editar el evento' });
    } else {
      console.log('Evento editado con éxito');
      res.status(200).json({ mensaje: 'Evento editado con éxito', evento: results });
    }
  });
});


// Ruta para crear roles dentro de un evento
app.post('/api/crear-rol/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const { nombre, descripcion } = req.body;

  // Middleware de autenticación: verifica si el token es válido
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Acceso no autorizado' });
    }

    // El token es válido, extrae el cod_usuario del payload
    const codUsuario = decoded.cod_user;

    // Realiza una consulta para verificar si el usuario es el organizador del evento
    const queryEvento = 'SELECT * FROM evento WHERE cod_evento = ? AND fk_usuario = ?';

    db.query(queryEvento, [eventId, codUsuario], (errEvento, resultsEvento) => {
      if (errEvento) {
        console.error('Error en la consulta de detalles del evento:', errEvento);
        res.status(500).json({ mensaje: 'Error en la consulta de detalles del evento' });
      } else {
        if (resultsEvento.length === 0) {
          // El usuario no es el organizador del evento
          res.status(403).json({ mensaje: 'No tienes permisos para crear roles en este evento' });
        } else {
          // El usuario es el organizador del evento, procede con la creación del rol
          const queryCrearRol = 'INSERT INTO rol (nombre, descripcion, fk_evento) VALUES (?, ?, ?)';
          const valuesCrearRol = [nombre, descripcion, eventId];

          db.query(queryCrearRol, valuesCrearRol, (errorCrearRol, resultsCrearRol) => {
            if (errorCrearRol) {
              console.error('Error al crear el rol:', errorCrearRol);
              res.status(500).json({ mensaje: 'Error al crear el rol' });
            } else {
              console.log('Rol creado con éxito');
              res.status(200).json({ mensaje: 'Rol creado con éxito', rol: resultsCrearRol });
            }
          });
        }
      }
    });
  });
});

app.post('/api/postularse-evento', async (req, res) => {
  try {
    // Middleware de autenticación: verifica si el token es válido
    const { codEvento, estadoSolicitud } = req.body;

    // Obtén el codUsuario del token
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado' });
    }

    jwt.verify(token.split(' ')[1], secretKey, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Acceso no autorizado' });
      }

      const codUsuario = decoded.cod_user;

      // Realiza la lógica para registrar la postulación en la base de datos
      const query = 'INSERT INTO solicitud (estado, fk_usuario, fk_evento) VALUES (?, ?, ?)';
      const values = [estadoSolicitud, codUsuario, codEvento];

      db.query(query, values, (error, results) => {
        if (error) {
          console.error('Error al procesar la solicitud de postulación:', error);
          res.status(500).json({ mensaje: 'Error al procesar la solicitud de postulación' });
        } else {
          console.log('Solicitud de postulación procesada con éxito');
          res.status(200).json({ mensaje: 'Solicitud de postulación procesada con éxito' });
        }
      });
    });
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(401).json({ error: 'Acceso no autorizado' });
  }
});

//EndPoint Update usuario
app.put('/ActualizarPerfil', (req, res) => {
  // Middleware de autenticación: verifica si el token es válido
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Acceso no autorizado' });
    }

    const codUsuario = decoded.cod_user;

    // Obtén los datos enviados en la solicitud
    const { numero, direccion, correo, comuna } = req.body;

    // Actualiza los datos del usuario en la base de datos
    const updateQuery = 'UPDATE usuario SET celular = ?, direccion = ?, correo = ?, fk_comuna = ? WHERE cod_usuario = ?';
    const updateValues = [numero, direccion, correo, comuna, codUsuario];

    // Ejecuta la consulta de actualización
    db.query(updateQuery, updateValues, (error, results) => {
      if (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ error: 'Error al actualizar el perfil' });
      } else {
        // Retorna un mensaje de éxito
        res.status(200).json({ mensaje: 'Perfil actualizado con éxito' });
      }
    });
  });
});


// Ruta en la que el servidor atiende las consultas
app.listen(port, () => {
  console.log(`Servidor en ejecución en 192.168.100.50:${port}`);
});