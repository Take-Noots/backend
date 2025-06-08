import { Request, Response } from 'express';
import { UserType } from './types/user';
import * as authService from "./service";

const Login = async (req: Request, res: Response) => {
    try {
        const result = await authService.login(req.body);
        const [user, accessToken, refreshToken] = result as [UserType, string, string];

        res.cookie('refresh_token', refreshToken, { httpOnly: true });
        res.json({
            message: 'Authentication successful',
            accessToken: accessToken,
            user: {
                name: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).send('Login failed: ' + (error instanceof Error ? error.message : String(error)));
    }
};

const Refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        res.status(200).json({ message: 'Refresh token missing' });
        return;
    }

    try  {
        const result = await authService.refresh(refreshToken);
        const [user, accessToken] = result as [UserType, string];

        res.json({
            message: 'Authentication successful',
            accessToken: accessToken,
            user: {
                name: user.username,
                email: user.email,
                role: user.role,
            },
        });
        
    } catch (error) {
        res.status(500).send('Refresh failed: ' + (error instanceof Error ? error.message : String(error)));
    }
};

const Register = async (req: Request, res: Response) => {
    try {
        const user: UserType = await authService.register(req.body);
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                name: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).send('Registration failed: ' + (error instanceof Error ? error.message : String(error)));
    }
};

const Logout = (req: Request, res: Response) => {
    res.clearCookie('refresh_token', {
        httpOnly: true,
    });

    res.status(200).json({ message: 'Logged out successfully' });
};


export { Login, Refresh, Register, Logout };