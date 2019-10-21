import React from 'react';
import { shallow } from 'enzyme';
import Button from './Button';

test('render a label', (): void => {
  const wrapper = shallow(<Button />);

  expect(wrapper).toMatchSnapshot();
});
