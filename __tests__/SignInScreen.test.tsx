// __tests__/SignInScreen.test.tsx
import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import SignInScreen from '../src/screens/SignInScreen';
import {AuthProvider} from '../src/context/AuthContext';

const mockNavigation = {replace: jest.fn(), navigate: jest.fn()} as any;

test('shows an error when email or password is missing', async () => {
  const {getByText} = render(
    <AuthProvider>
      <SignInScreen navigation={mockNavigation} />
    </AuthProvider>,
  );

  fireEvent.press(getByText('SIGN IN'));
  await waitFor(() => {
    expect(getByText('Please enter both email and password')).toBeTruthy();
  });
});

test('navigates to Dashboard on valid sign in', async () => {
  // Mock fetch response for successful sign in.
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    }),
  ) as jest.Mock;

  const {getByPlaceholderText, getByText} = render(
    <AuthProvider>
      <SignInScreen navigation={mockNavigation} />
    </AuthProvider>,
  );

  // Fill in email and password fields.
  fireEvent.changeText(
    getByPlaceholderText('Enter your email'),
    'test@example.com',
  );
  fireEvent.changeText(
    getByPlaceholderText('Enter your password'),
    'Password123',
  );

  fireEvent.press(getByText('SIGN IN'));

  await waitFor(() => {
    expect(mockNavigation.replace).toHaveBeenCalledWith('Dashboard');
  });
});
