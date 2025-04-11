import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import DashboardScreen from '../src/screens/DashboardScreen';
import {Alert} from 'react-native';

const mockNavigation = {navigate: jest.fn(), replace: jest.fn()};

describe('DashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial system message', () => {
    const {getByText} = render(<DashboardScreen navigation={mockNavigation} />);
    expect(getByText('How are you feeling today?')).toBeTruthy();
  });

  it('sends a message and displays system response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({answer: 'Test answer from API.'}),
    });

    const {getByPlaceholderText, getByTestId, findByText} = render(
      <DashboardScreen navigation={mockNavigation} />,
    );

    const input = getByPlaceholderText('Describe your symptoms...');
    fireEvent.changeText(input, 'I have a headache.');

    fireEvent.press(getByTestId('sendButton'));

    expect(await findByText('Test answer from API.')).toBeTruthy();
  });

  it('shows alert if sending empty message', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const {getByTestId} = render(
      <DashboardScreen navigation={mockNavigation} />,
    );

    fireEvent.press(getByTestId('sendButton'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Please enter a message.');
    });
  });
});
