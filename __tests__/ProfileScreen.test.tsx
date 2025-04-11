import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import ProfileScreen from '../src/screens/ProfileScreen';
import {Alert} from 'react-native';

// Mock the useAuth hook directly
jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    userEmail: 'user@example.com',
  }),
}));

describe('ProfileScreen', () => {
  const mockNavigation = {goBack: jest.fn()};

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        email: 'user@example.com',
        first_name: 'First',
        last_name: 'Last',
        dob: '01/01/1990',
        height: '5.8 FT',
        weight: '70 KG',
      }),
    });
  });

  it('renders ProfileScreen with user data', async () => {
    const {getByText} = render(<ProfileScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('user@example.com')).toBeTruthy();
      expect(getByText('First')).toBeTruthy();
      expect(getByText('Last')).toBeTruthy();
    });
  });

  it('handles profile fetch failure gracefully', async () => {
    const alertMock = jest.spyOn(Alert, 'alert');
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({detail: 'Error fetching user'}),
    });

    render(<ProfileScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Error', 'Error fetching user');
    });
  });
});
