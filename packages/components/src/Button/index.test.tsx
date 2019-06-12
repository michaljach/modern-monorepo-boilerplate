import * as React from 'react';
import Button from '.';
import { shallow } from 'enzyme';

test('render a label', (): void => {
  const wrapper = shallow(<Button/>);

  expect(wrapper).toMatchSnapshot();
});