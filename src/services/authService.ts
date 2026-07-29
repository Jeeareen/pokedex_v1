import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from 'firebase/auth'
import { auth } from './firebaseService'

function formatAuthError(error: unknown): Error {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code
    switch (code) {
      case 'auth/email-already-in-use':
        return new Error('This email address is already in use.')
      case 'auth/invalid-email':
        return new Error('Invalid email address format.')
      case 'auth/operation-not-allowed':
        return new Error('Email/password accounts are not enabled in Firebase.')
      case 'auth/weak-password':
        return new Error('Password is too weak. Please use at least 6 characters.')
      case 'auth/user-disabled':
        return new Error('This user account has been disabled.')
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return new Error('No account with this mail was found')
      case 'auth/too-many-requests':
        return new Error('Too many unsuccessful attempts. Please try again later.')
      default:
        return new Error(
          (error as { message?: string }).message || 'An authentication error occurred.'
        )
    }
  }
  return error instanceof Error ? error : new Error(String(error))
}

export async function registerUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    throw formatAuthError(error)
  }
}

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    throw formatAuthError(error)
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth)
  } catch (error) {
    throw formatAuthError(error)
  }
}

export function subscribeToAuthChanges(
  callback: (user: User | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, callback)
}
