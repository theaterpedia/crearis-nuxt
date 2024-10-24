import { useSfProductAttribute } from '../useSfProductAttribute';
import { mockProduct } from './useSfProduct.mock';

describe('useSfProductAttribute', () => {
  it('should return product attributes', () => {
    const { getAttributeList, getAttribute } = useSfProductAttribute(mockProduct, ['attribute']);

    const attributeList = getAttributeList('attribute');
    const attributeValue = getAttribute('attribute');

    expect(attributeList).toEqual([]);
    expect(attributeValue).toEqual(null);
  });
});
