import { defineStore } from 'pinia';
import {getOrders} from '@/services/order/order-history-service.ts';
import type { OrderHistory } from '@/models/order/order-history.ts';

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [] as OrderHistory[],
    loading: false,
    error: null as string | null,
  }),
  getters: {
    activeOrders(state) {
      return state.orders.filter(order => order.done);
    },
    completedOrders(state) {
      return state.orders.filter(order => !order.done );
    },
  },
  actions: {
    async loadOrders()  {
      this.loading = true;
      this.error = null;
      try {
        this.orders = await getOrders();
      } catch (err) {
        this.error = (err as Error).message;
      } finally {
        this.loading = false;
      }
    },
  },
});
