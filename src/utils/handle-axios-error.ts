import axios from 'axios';

export function handleAxiosError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data?.error === 'string') {
      return data.error;
    }

    if (data?.errors && typeof data.errors === 'object') {
      return Object
        .values(data.errors)
        .flat()
        .join('\n');
    }

    return 'Erreur du serveur.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Erreur réseau ou serveur inconnue.';
}
