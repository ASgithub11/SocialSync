import { Router, type Request, type Response } from 'express';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try{
  // checks user
  const user = await User.findOne({
    where: { email },
  });
  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // checks password
  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  //secret key for signing token
  const secretKey = process.env.JWT_SECRET_KEY || '';
  if (!secretKey) {
    return res.status(500).json({ message: 'Internal server error' });
  }

  // create token
  const token = jwt.sign({ userId: user.id, email }, secretKey, { expiresIn: '1d' });
  return res.json({ token });
} catch (error) {
    console.error('Error during login', error);
    return res.status(500).json({ message: 'Internal server error' });
}
};

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // checks if user already exists
    const existingUser = await User.findOne({
      where: { email },
  });

  if (existingUser) {
    return res.status(409).json({ message: 'Email already in use.' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error during signup', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const router = Router();

// post /login - login user
router.post('/login', login);

// post /signup - signup user
router.post('/signup', signup);

export default router;
