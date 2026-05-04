<template>
  <div class="conekta-admin">
    <header>
      <h2>{{ $t('conektaAdmin.orders.title') }}</h2>
      <select v-model="methodFilter">
        <option value="">
          {{ $t('conektaAdmin.orders.allMethods') }}
        </option>
        <option value="card">
          card
        </option>
        <option value="oxxo_cash">
          oxxo_cash
        </option>
        <option value="spei">
          spei
        </option>
      </select>
    </header>
    <div v-if="loading">
      {{ $t('conektaAdmin.orders.loading') }}
    </div>
    <div
      v-else-if="error"
      class="error"
    >
      {{ error }}
    </div>
    <table
      v-else-if="filtered.length > 0"
      class="txtable"
    >
      <thead>
        <tr>
          <th>Invoice</th>
          <th>Method</th>
          <th>Amount</th>
          <th>MSI</th>
          <th>Ref / CLABE</th>
          <th>Status</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="o in filtered"
          :key="o.id"
        >
          <td>{{ o.invoice_no }}</td>
          <td>{{ o.method }}</td>
          <td>{{ o.amount }} {{ o.currency }}</td>
          <td>{{ o.msi || '—' }}</td>
          <td>{{ o.reference || o.clabe || '—' }}</td>
          <td>
            <span :class="['status', `status--${o.status}`]">{{ o.status }}</span>
          </td>
          <td>
            <button
              v-if="o.status === 'completed'"
              class="btn btn--refund"
              @click="onRefund(o)"
            >
              {{ $t('conektaAdmin.orders.refund') }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      {{ $t('conektaAdmin.orders.empty') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, storeToRefs } from 'vue';
import { useConektaStore, type ConektaOrder } from '../stores/conekta';
import { api } from '@/api';

const store = useConektaStore();
const { filtered, methodFilter, loading, error } = storeToRefs(store);

onMounted(() => store.fetchOrders(api));

async function onRefund(o: ConektaOrder) {
  try {
    await store.refund(o.invoice_no, null, api);
    await store.fetchOrders(api);
  } catch (e) {
    window.alert(e instanceof Error ? e.message : 'refund failed');
  }
}
</script>

<style scoped>
.conekta-admin { padding: 1.5rem; }
header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.txtable { width: 100%; border-collapse: collapse; }
.txtable th, .txtable td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--vbwd-color-border, #e5e5e5); text-align: left; }
.status--completed { color: var(--vbwd-color-success, #2a7); }
.status--failed, .status--cancelled, .status--expired { color: var(--vbwd-color-danger, #b22); }
</style>
