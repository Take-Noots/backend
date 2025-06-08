import { User } from './model';
import jwt from 'jsonwebtoken';

const myAccessToken = "owls-can-make-secret-sauce";
const myRefreshToken = "owls-stay-fresh-af";

const login = async ({email, password}: {email: string, password: string}) => {
    const user = await User.findOne({ email });
    
    if (!user) {
        throw new Error('User not found');
    }

    if (user.password !== password) {
        throw new Error('Invalid password');
    }

    const current_time = Math.floor(Date.now() / 1000);
    const access_expiration_time = current_time + 900; // 15 minutes
    const refresh_expiration_time = current_time + 604800; // 7 days

    const accessClaims = {
        sub: user._id.toString(),
        exp: access_expiration_time,
    };

    const refreshClaims = {
        sub: user._id.toString(),
        exp: refresh_expiration_time,
    };

    const accessToken = jwt.sign(accessClaims, myAccessToken, { algorithm: 'HS256' });
    const refreshToken = jwt.sign(refreshClaims, myRefreshToken, { algorithm: 'HS256' });

    return [ user, accessToken, refreshToken ];
}

const refresh = async (refreshToken: string) => {
    let user: any; // Declare user outside the scope
    let accessToken: string = ''; // Initialize accessToken

    await new Promise((resolve, reject) => {
        jwt.verify(refreshToken, myRefreshToken, async (err: Error | null, payload: any) => {
            if (err) {
                // console.log(refreshToken, myRefreshToken);
                return reject(new Error('Invalid refresh token'));
            }

            try {
                user = await User.findById(payload.sub); // Use `sub` from claims

                if (!user) {
                    return reject(new Error('User not found'));
                }

                // Generate new access token
                const current_time = Math.floor(Date.now() / 1000);
                const expiration_time = current_time + 900; // 15 minutes
                const private_key = myAccessToken; // Use the access token as the private key
                const claims = {
                    sub: user._id.toString(),
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
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Create a new user
        const newUser = new User({ username, email, role, password });
        await newUser.save();

        return newUser;
    } catch (err) {
        throw new Error('Registration failed: ' + (err instanceof Error ? err.message : String(err)));
    }
}

export { login, refresh, register };