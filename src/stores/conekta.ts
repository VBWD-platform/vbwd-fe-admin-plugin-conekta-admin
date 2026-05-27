import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface ConektaOrder {
  id: string;
  invoice_no: string;
  order_id: string | null;
  method: string;
  amount: string;
  currency: string;
  msi: number | null;
  reference: string | null;
  clabe: string | null;
  status: string;
  last_provider_status: string | null;
  created_at: string | null;
}

/** Minimal surface of the host's ``@/api`` ApiClient — promise-returning,
    already-parsed body. Each plugin types its store against this so the
    view can pass ``api`` from the host without TS complaints. */
interface ApiClientLike {
  get<T = unknown>(url: string, config?: unknown): Promise<T>;
  post<T = unknown>(url: string, body?: unknown, config?: unknown): Promise<T>;
}

export const useConektaStore = defineStore('conekta-admin', () => {
  const orders = ref<ConektaOrder[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const methodFilter = ref<string>('');

  const filtered = computed(() =>
    methodFilter.value
      ? orders.value.filter((o) => o.method === methodFilter.value)
      : orders.value,
  );

  async function fetchOrders(api: ApiClientLike) {
    loading.value = true;
    error.value = null;
    try {
      const body = await api.get<{ orders: ConektaOrder[] }>('/api/v1/plugins/conekta/orders');
      orders.value = body.orders || [];
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'failed';
    } finally {
      loading.value = false;
    }
  }

  async function refund(
    invoiceNo: string,
    amount: number | null,
    api: ApiClientLike,
  ) {
    return api.post(`/api/v1/plugins/conekta/orders/${invoiceNo}/refund`,
      amount !== null ? { amount } : {},);
  }

  return { orders, filtered, methodFilter, loading, error, fetchOrders, refund };
});
