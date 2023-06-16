import express from 'express';
import { UserModel } from '../DAO/models/users.model.js';

export const usersHtmlRouter = express.Router();
usersHtmlRouter.get('/', async (req, res) => {
  const { page /* , limit, query, sort */ } = req.query;
  console.log(page);
  const users = await UserModel.paginate({}, { limit: /*  limit || */ 10, page: page || 1 });
  let usuarios = users.docs.map((user) => {
    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  });

  // pagingCounter: 71,

  // totalPages: 3001,
  // page: 8,
  // hasPrevPage: true,
  // hasNextPage: true,
  // prevPage: 7,
  // nextPage: 9

  /* let links = [];
  for (let i = 1; i < users.totalPages + 1; i++) {
    links.push({ label: i, href: 'http://localhost:8000/users/?page=' + i });
  } */

  //ojo!!!! es res.json()
  return res.status(200).render('usuarios', {
    //status:success/error
    //payload: en vez de usuarios como nombre de la propiedad
    usuarios: usuarios,
    //buscar en las diapositivas exactamente cuales hay que enviar
    pagingCounter: users.pagingCounter,
    totalPages: users.totalPages,
    page: users.page,
    hasPrevPage: users.hasPrevPage,
    hasNextPage: users.hasNextPage,
    prevPage: users.prevPage,
    nextPage: users.nextPage /* ,: users., links */,
    /* links: links, */
  });
});
