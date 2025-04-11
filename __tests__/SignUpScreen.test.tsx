// __tests__/SignUpScreen.test.tsx
import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import SignUpScreen from '../src/screens/SignUpScreen';
import {AuthProvider} from '../src/context/AuthContext';

const mockNavigation = {replace: jest.fn(), navigate: jest.fn()} as any;

test('shows validation errors when fields are empty', async () => {
  const {getByText} = render(
    <AuthProvider>
      <SignUpScreen navigation={mockNavigation} />
    </AuthProvider>,
  );

  fireEvent.press(getByText('SIGN UP'));
  await waitFor(() => {
    expect(getByText('First name is required')).toBeTruthy();
    expect(getByText('Last name is required')).toBeTruthy();
    expect(getByText('Valid date required (MM/DD/YYYY)')).toBeTruthy();
  });
});

test('navigates to Dashboard on successful sign up', async () => {
  // Mock fetch for a successful sign up response.
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    }),
  ) as jest.Mock;

  const {getByPlaceholderText, getByText} = render(
    <AuthProvider>
      <SignUpScreen navigation={mockNavigation} />
    </AuthProvider>,
  );

  // Fill in the required fields.
  fireEvent.changeText(getByPlaceholderText('e.g. John'), 'John');
  fireEvent.changeText(getByPlaceholderText('e.g. Doe'), 'Doe');
  fireEvent.changeText(getByPlaceholderText('MM/DD/YYYY'), '12/31/1990');
  fireEvent.changeText(getByPlaceholderText(/Height in/), '5.8');
  fireEvent.changeText(getByPlaceholderText(/Weight in/), '70');
  fireEvent.changeText(
    getByPlaceholderText('email@example.com'),
    'john.doe@example.com',
  );
  fireEvent.changeText(
    getByPlaceholderText('Create a password'),
    'Password123',
  );
  fireEvent.changeText(
    getByPlaceholderText('Re-enter your password'),
    'Password123',
  );

  fireEvent.press(getByText('SIGN UP'));

  await waitFor(() => {
    expect(mockNavigation.replace).toHaveBeenCalledWith('Dashboard');
  });
});
