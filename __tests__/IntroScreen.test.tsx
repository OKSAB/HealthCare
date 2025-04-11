// __tests__/IntroScreen.test.tsx
import React from 'react';
import {render} from '@testing-library/react-native';
import IntroScreen from '../src/screens/IntroScreen';

// Create a dummy navigation object since IntroScreen uses navigation.replace
const mockNavigation = {replace: jest.fn()} as any;

test('renders IntroScreen and navigates after animation', async () => {
  const {getByText} = render(<IntroScreen navigation={mockNavigation} />);

  // Assert that key text elements exist
  expect(getByText('HealthCare')).toBeTruthy();
  expect(getByText('Welcome to HealthCare')).toBeTruthy();

  // Fast-forward timers to simulate the animation completion:
  jest.runAllTimers();

  // After animation completes, it should trigger navigation to 'SignIn'
  expect(mockNavigation.replace).toHaveBeenCalledWith('SignIn');
});
