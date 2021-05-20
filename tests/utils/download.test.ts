import {} from '@testing-library/dom';
import { download } from '../../src/utils';

afterEach(() => {
  jest.restoreAllMocks();
});

it(`Should download file`, () => {
  const clickStub = jest.spyOn(HTMLAnchorElement.prototype, 'click');
  const element = download(`temp`, 'dummy text');
  expect(element.getAttribute('href')).toStrictEqual(
    'data:text/plain;charset=utf-8,dummy%20text'
  );
  expect(element.getAttribute('download')).toStrictEqual(`temp`);
  expect(element.style.display).toStrictEqual('none');
  expect(clickStub).toHaveBeenCalledTimes(1);
});
