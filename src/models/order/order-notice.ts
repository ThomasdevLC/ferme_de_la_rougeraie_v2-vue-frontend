/** Message affiché en haut de l'historique après une action faite ailleurs (ex. annulation depuis le panier). */
export interface OrderNotice {
  type: 'success' | 'error';
  text: string;
}
