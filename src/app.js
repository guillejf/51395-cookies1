import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import { petsRouter } from './routes/pets.router.js';
import { testSocketChatRouter } from './routes/test.socket.chat.router.js';
import { usersRouter } from './routes/users.router.js';
import { usersHtmlRouter } from './routes/users.html.router.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import { __dirname, connectMongo, connectSocket } from './utils.js';
const app = express();
const port = 8000;

const httpServer = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

connectMongo();
connectSocket(httpServer);

// app.use(cookieParser('sd768huehgjUYTe98rt78GJGEiu7'));
app.use(session({ secret: 'sd768huehgjUYTe98rt78GJGEiu7', resave: true, saveUninitialized: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

//Rutas: API REST CON JSON
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);

app.use('/html/users', usersHtmlRouter);

//Rutas: SOCKETS
app.use('/test-chat', testSocketChatRouter);

app.get('/session', (req, res) => {
  console.log(req.session);
  if (req.session?.cont) {
    req.session.cont++;
    res.send(JSON.stringify(req.session));
  } else {
    req.session.cont = 1;
    req.session.busqueda = 'cetosis';
    res.send(JSON.stringify(req.session));
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ status: 'session eliminar ERROR' });
    }
    res.send('Logout ok!');
  });
});

app.get('/login', (req, res) => {
  const { username, password } = req.query;
  if (username !== 'pepe' || password !== 'pepepass') {
    return res.send('login failed');
  }
  req.session.user = username;
  req.session.admin = false;
  res.send('login success!');
});

app.get('/abierta', (req, res) => {
  res.send('informacion abierta a publico');
});

function checkLogin(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    return res.status(401).send('error de autorización!');
  }
}

app.get('/perfil', checkLogin, (req, res) => {
  res.send('todo el perfile');
});

app.get('*', (req, res) => {
  // console.log(req.signedCookies);
  return res.status(404).json({
    status: 'error',
    msg: 'no encontrado',
    data: {},
  });
});
