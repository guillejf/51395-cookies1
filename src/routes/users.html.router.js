import express from 'express';
import { UserModel } from '../DAO/models/users.model.js';

export const usersHtmlRouter = express.Router();

usersHtmlRouter.get('/', async (req, res) => {
  try {
    const { querypage } = req.query;
    const queryResult = await UserModel.paginate(
      {
        /* query y sort */
      },
      { limit: 10, page: querypage || 1 }
    );
    let usuariosPaginados = queryResult.docs;
    const { totalDocs, limit, totalPages, page, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage } = queryResult;

    usuariosPaginados = usuariosPaginados.map((item) => {
      return {
        _id: item._id.toString(),
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
      };
    });

    return res.status(200).render('users-list', { usuariosPaginados, totalDocs, limit, totalPages, page, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage });
  } catch (e) {
    console.log(e);
    return res.status(500).render('error-users-list');
  }
});
