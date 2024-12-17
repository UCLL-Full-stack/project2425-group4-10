import { User } from '../model/user'
import database from '../util/database'

const getAllUsers = async (): Promise<User[]> => {
  try {
      const usersPrisma = await database.user.findMany()
      return usersPrisma.map((userPrisma) => User.from(userPrisma))
  } catch (error) {
      throw new Error('Database error. See server log for details.')
  }
}
const getAllCoaches = async (): Promise<User[]> => {
  try {
      const usersPrisma = await database.user.findMany({
          where: {
              role: 'coach',
          },
          include: {
          }
      });
      return usersPrisma.map((userPrisma) => User.from(userPrisma));
  } catch (error) {
      throw new Error('Database error. See server log for details.');
  }
};
const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
  try {
      const userPrisma = await database.user.findUnique({
          where: { id },
      })
      return userPrisma ? User.from(userPrisma) : null
  } catch (error) {
      throw new Error('Database error. See server log for details.')
  }
}

const getUserByUsername = async ({ username }: { username: string }): Promise<User | null> => {
  try {
      const userPrisma = await database.user.findFirst({
          where: { username },
      })
      return userPrisma ? User.from(userPrisma) : null
  } catch (error) {
      throw new Error('Database error. See server log for details.')
  }
}

const getUserByEmail = async ({ email }: { email: string }): Promise<User | null> => {
  try {
      const userPrisma = await database.user.findFirst({
          where: { email },
      })
      return userPrisma ? User.from(userPrisma) : null
  } catch (error) {
      throw new Error('Database error. See server log for details.')
  }
}

const createUser = async ({
    username,
    password,
    firstName,
    lastName,
    email,
    role,
}: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}): Promise<User> => {
  try {
      const userPrisma = await database.user.create({
          data: { username, password, firstName, lastName, email, role },
      })
      return User.from(userPrisma);
  } catch (error) {
      throw new Error('Database error. See server log for details.')
  }
}

export default {
  getAllUsers,
  createUser,
  getUserById,
  getUserByUsername,
  getUserByEmail
}