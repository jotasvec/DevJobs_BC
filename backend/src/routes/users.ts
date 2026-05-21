import { Router } from "express";

const usersRouter : Router = Router()

// get all users, 
usersRouter.get('/')

//get by id
usersRouter.get('/:id')

// Admin endpoints (need admin middleware - to be added)
usersRouter.patch('/:id')
usersRouter.put('/:id')
usersRouter.delete('/:id')

export { usersRouter }