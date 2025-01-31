import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@abticketing/common';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';
import { User } from '../models/user-model';
const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Enter valid email'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    // Add more validation rules as needed
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials ');
    }
    const matchPassword = await Password.compare(
      existingUser.password,
      password
    );
    if (!matchPassword) {
      throw new BadRequestError('Invalid credentials');
    }
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };
    res.status(200).send(existingUser);
  }
);

export { router as SigninRouter };
