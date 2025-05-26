import axios from 'axios';

export function handleAxiosError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error ?? 'Erreur du serveur.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Erreur réseau ou serveur inconnue.';
}
