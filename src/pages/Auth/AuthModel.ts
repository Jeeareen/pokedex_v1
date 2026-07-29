import {
  registerUser,
  loginUser,
  logoutUser,
} from '../../services/authService'
import type { User } from 'firebase/auth'

export class AuthModel {
  static async register(email: string, password: string): Promise<User> {
    return register(email, password)
  }

  static async login(email: string, password: string): Promise<User> {
    return login(email, password)
  }

  static async logout(): Promise<void> {
    return logout()
  }
}

function validateAndNormalize(email: string, password: string): {
  normalizedEmail: string
  validPassword: string
} {
  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail) {
    throw new Error('Email address is required.')
  }

  if (!password) {
    throw new Error('Password is required.')
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.')
  }

  return { normalizedEmail, validPassword: password }
}

export async function register(email: string, password: string): Promise<User> {
  const { normalizedEmail, validPassword } = validateAndNormalize(email, password)
  return await registerUser(normalizedEmail, validPassword)
}

export async function login(email: string, password: string): Promise<User> {
  const { normalizedEmail, validPassword } = validateAndNormalize(email, password)
  return await loginUser(normalizedEmail, validPassword)
}

export async function logout(): Promise<void> {
  await logoutUser()
}
