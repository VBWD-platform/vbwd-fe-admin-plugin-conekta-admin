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

  async function fetchOrders(api: { get: typeof fetch }) {
    loading.value = true;
    error.value = null;
    try {
      const resp = await api.get('/api/v1/plugins/conekta/orders');
      const body = await resp.json();
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
    api: { post: (url: string, body: unknown) => Promise<Response> },
  ) {
    const resp = await api.post(
      `/api/v1/plugins/conekta/orders/${invoiceNo}/refund`,
      amount !== null ? { amount } : {},
    );
    if (!resp.ok) throw new Error(`refund failed: ${resp.status}`);
    return resp.json();
  }

  return { orders, filtered, methodFilter, loading, error, fetchOrders, refund };
});
