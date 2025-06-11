import { User } from './model';
import { UserType } from './types/user';

export const findUserByEmail = async (email: string) => {
    return await User.findOne({ email });
};

export const findUserById = async (id: string) => {
    return await User.findById(id);
};

export const createUser = async ({ email, username, password, role }: { email: string, username: string, password: string, role: string }) => {
    const newUser = new User({ username, email, role, password });
    await newUser.save();
    
    // Convert to UserType
    const user: UserType = {
        _id: newUser._id.toString(),
        email: newUser.email,
        username: newUser.username,
        password: newUser.password,
        role: newUser.role,
    };
    
    return user;
};
