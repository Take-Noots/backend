import 'dotenv/config';
import { findUserByEmail, findUserById, createUser } from './repository';
import jwt from 'jsonwebtoken';


const myAccessSecret = process.env.ACCESS_TOKEN_SECRET as string;
const myRefreshSecret = process.env.REFRESH_TOKEN_SECRET as string;
const myAccessTokenDuration = process.env.ACCESS_TOKEN_DURATION ? parseInt(process.env.ACCESS_TOKEN_DURATION) : 900; // 15 minutes
const myRefreshTokenDuration = process.env.REFRESH_TOKEN_DURATION ? parseInt(process.env.REFRESH_TOKEN_DURATION) : 604800; // 7 days

const login = async ({email, password}: {email: string, password: string}) => {
    const user = await findUserByEmail(email);
    
    if (!user) {
        throw new Error('User not found');
    }

    if (user.password !== password) {
        throw new Error('Invalid password');
    }

    const current_time = Math.floor(Date.now() / 1000);
    const access_expiration_time = current_time + myAccessTokenDuration; 
    const refresh_expiration_time = current_time + myRefreshTokenDuration; 

    const accessClaims = {
        sub: user._id.toString(), // Use user ID in JWT claims
        exp: access_expiration_time,
    };

    const refreshClaims = {
        sub: user._id.toString(), // Use user ID in JWT claims
        exp: refresh_expiration_time,
    };

    const accessToken = jwt.sign(accessClaims, myAccessSecret, { algorithm: 'HS256' });
    const refreshToken = jwt.sign(refreshClaims, myRefreshSecret, { algorithm: 'HS256' });

    return [ user, accessToken, refreshToken ];
}

const refresh = async (refreshToken: string) => {
    let user: any; // Declare user outside the scope
    let accessToken: string = ''; // Initialize accessToken

    await new Promise((resolve, reject) => {
        jwt.verify(refreshToken, myRefreshSecret, async (err: Error | null, payload: any) => {
            if (err) {
                // console.log(refreshToken, myRefreshSecret);
                return reject(new Error('Invalid refresh token'));
            }

            try {
                user = await findUserById(payload.sub); // Use repository function

                if (!user) {
                    return reject(new Error('User not found'));
                }

                // Generate new access token
                const current_time = Math.floor(Date.now() / 1000);
                const expiration_time = current_time + myAccessTokenDuration;
                const private_key = myAccessSecret; 
                const claims = {
                    sub: user._id.toString(), // Use user ID in JWT claims
                    exp: expiration_time,
                };

                accessToken = jwt.sign(claims, private_key, { algorithm: 'HS256' });
                resolve(null);
            } catch (error) {
                reject(error);
            }
        });
    });

    return [user, accessToken];
}

const register = async ({ email, username, password, role }: { email: string, username: string, password: string, role: string }) => {
    if (!username || !email || !role || !password) {
        throw new Error('Empty register feilds found');
    }

    try {
        // Check if the email already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Create a new user using repository
        const user = await createUser({ email, username, password, role });
        return user;
    } catch (err) {
        throw new Error('Registration failed: ' + (err instanceof Error ? err.message : String(err)));
    }
}


const validateToken = async (token: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, myAccessSecret, async (err: Error | null, payload: any) => {
            if (err) {
                return reject(new Error('Invalid or expired token'));
            }
            resolve(payload.sub);
        });
    });
};

export { login, refresh, register, validateToken };