import 'server-only';

import bcrypt from 'bcrypt';
import { User } from '@/types';
import { getUsers, addUser, findUserByUsername } from '@/services/users.server';

const SALT_ROUNDS = 10;

export async function authRegister(username: string, password: string): Promise<User | null> {

    const users = (await getUsers()).rows;

    const exists =  users.find(
        (user: User) => user.username === username
    );

    if (exists) return null;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await addUser(username, hashedPassword);

    return user || null;
}

export async function authLogin(username: string, password: string): Promise<User | null> {

    const user = await findUserByUsername(username);

    if (!user) return null

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) return null

    return {
        id: user.id,
        username: user.username
    }

}
