// import { SdkModule, sdkModule } from '@crearis/crearis-boilerplate-sdk';
import { OdooModule } from '@erpgap/odoo-sdk'

export default defineSdkConfig(({ buildModule, middlewareUrl }) => ({
  // commerce: buildModule(sdkModule),
  odoo: buildModule(OdooModule, { apiUrl: `${middlewareUrl}api/odoo/`, ofetch: useFetch }),
}))
