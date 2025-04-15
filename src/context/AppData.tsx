import React, {createContext, useContext, useState, ReactNode} from 'react';

interface Conversation {
  id: string;
  title: string;
  chats: Array<{chat_type: string; text: string}>;
}

interface AppDataContextType {
  chats: Conversation[] | null;
  setConversations: (chats: Conversation[] | []) => void;
  deleteConversation: (id: string) => void;
  activeConversation: Conversation | null; // Active conversation
  setActiveConversation: (id: string) => void; // Function to set active conversation
  updateConversations: (conversation: Conversation) => void; //Updates an existing conversation or adds a new conversation to state
}

const AppDataContext = createContext<AppDataContextType>({
  chats: null,
  setConversations: () => {},
  deleteConversation: () => {},
  activeConversation: null,
  setActiveConversation: () => {},
  updateConversations: () => {},
});

export function AppDataProvider({children}: {children: ReactNode}) {
  const [chats, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversationState] =
    useState<Conversation | null>(null);

  // deleteConversation function
  const deleteConversation = (id: string) => {
    if (chats) {
      const updatedChats = chats.filter(chat => chat.id !== id); // Remove the conversation with the given id
      setConversations(updatedChats); // Update the state
    }
  };

  // Define the setActiveConversation function
  const setActiveConversation = (id: string) => {
    // if (chats) {
    const conversation = chats.find(chat => chat.id === id) || null; // Find the conversation by id
    setActiveConversationState(conversation); // Set the active conversation
    // }
  };

  // updateConversations function
  const updateConversations = (updatedConversation: Conversation) => {
    const conversationExists = chats.some(
      chat => chat.id === updatedConversation.id,
    );

    if (conversationExists) {
      // Update the existing conversation using map (as your original logic correctly does for updating)
      const updatedChats = chats.map(chat =>
        chat.id === updatedConversation.id ? updatedConversation : chat,
      );
      setConversations(updatedChats);
    } else {
      // Add the new conversation to the existing array
      setConversations([...chats, updatedConversation]);
    }
  };

  return (
    <AppDataContext.Provider
      value={{
        chats,
        setConversations,
        deleteConversation,
        activeConversation,
        setActiveConversation,
        updateConversations,
      }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}
