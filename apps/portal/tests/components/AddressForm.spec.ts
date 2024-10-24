import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AddressForm from '#imports'

describe('<AddressForm />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(AddressForm, {
      props: {
        type: 'billingAddress',
      },
    })
    expect(getByTestId('address-form'))
  })
})
