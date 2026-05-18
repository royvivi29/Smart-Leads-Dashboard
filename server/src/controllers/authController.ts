import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/token';
import { AppError } from '../utils/AppError';
import { AuthRequest, ApiResponse, IUser } from '../types';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('An account with this email already exists', 409);
    }

    const user = await User.create({ name, email, password, role });

    const token = generateToken({ id: user._id.toString(), role: user.role });

    const response: ApiResponse = {
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      message: 'Account created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = (await User.findOne({ email }).select('+password')) as IUser | null;
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken({ id: user._id.toString(), role: user.role });

    const response: ApiResponse = {
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const response: ApiResponse = {
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
