import express from 'express';
import path from 'path';
import indexRoutes from './routes/index_routes';
import brokenAuth from './routes/broken_auth';
import sqlIncjection from './routes/sql_injection';
import database from './routes/db_contents';



const app = express();
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', indexRoutes);
app.use('/sqlInjection', sqlIncjection);
app.use('/brokenAuth', brokenAuth);
app.use('/database', database);

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  next(err);
});

app.listen(3000, () => {
  console.log('Listening...');
});
