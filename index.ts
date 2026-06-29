import type { IPlugin, IPlatformSDK } from 'vbwd-view-component';

export const conektaAdminPlugin: IPlugin = {
  name: 'conekta-admin',
  version: '26.6',
  description: 'Conekta admin — orders list (card/OXXO/SPEI) + refund',

  install(sdk: IPlatformSDK) {
    sdk.addRoute({
      path: 'conekta/orders',
      name: 'conekta-orders',
      component: () => import('./src/views/ConektaOrders.vue'),
      meta: { requiredPermission: 'payments.configure' },
    });
  },

  activate() {},
  deactivate() {},
};
