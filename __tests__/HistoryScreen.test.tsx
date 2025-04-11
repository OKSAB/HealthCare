import React from 'react';
import {render, waitFor, fireEvent} from '@testing-library/react-native';
import HistoryScreen from '../src/screens/HistoryScreen';

const mockNavigation = {goBack: jest.fn()};

const mockChats = [
  {id: 1, title: 'Chat 1', created_at: '2023-01-01', messages: []},
  {id: 2, title: 'Chat 2', created_at: '2023-01-02', messages: []},
];

describe('HistoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat history correctly', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockChats,
    });

    const {findByText} = render(<HistoryScreen navigation={mockNavigation} />);

    expect(await findByText('Chat 1')).toBeTruthy();
    expect(await findByText('Chat 2')).toBeTruthy();
  });

  it('calls delete action for a chat', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ok: true, json: async () => mockChats}) // for loading chats
      .mockResolvedValueOnce({ok: true}); // for delete

    const {findByText, getByTestId} = render(
      <HistoryScreen navigation={mockNavigation} />,
    );

    expect(await findByText('Chat 1')).toBeTruthy();

    const deleteButton = getByTestId('deleteButton-1');
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/chats/1'),
        expect.objectContaining({method: 'DELETE'}),
      );
    });
  });
});
