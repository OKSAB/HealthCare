import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../context/AuthContext';

type RootStackParamList = {
  Dashboard: {chatId?: number; chatTitle?: string} | undefined;
  History: undefined;
};

type HistoryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'History'
>;

interface Chat {
  id: number;
  title: string;
  created_at: string;
}

const {width, height} = Dimensions.get('window');

const HistoryScreen: React.FC<{navigation: HistoryScreenNavigationProp}> = ({
  navigation,
}) => {
  const {userEmail} = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  const fetchChats = async () => {
    if (!userEmail) {
      Alert.alert('Error', 'No userEmail found in global context');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/chats?email=${encodeURIComponent(userEmail)}`,
      );
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to fetch chats');
      }
      const data = await response.json();
      setChats(
        data.sort(
          (a: Chat, b: Chat) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const openChat = (chat: Chat) => {
    navigation.navigate('Dashboard', {chatId: chat.id, chatTitle: chat.title});
  };

  const startEditing = (chat: Chat) => {
    setEditingChatId(chat.id);
    setEditedTitle(chat.title);
  };

  const submitTitleChange = async (chatId: number) => {
    if (!editedTitle.trim()) {
      Alert.alert('Error', 'Title cannot be empty.');
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/chats/${chatId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title: editedTitle}),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to update title');
      }
      setEditingChatId(null);
      fetchChats();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const deleteChat = (chatId: number) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this chat?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                `http://127.0.0.1:8000/chats/${chatId}`,
                {
                  method: 'DELETE',
                },
              );
              if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Failed to delete chat');
              }
              fetchChats();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat History</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={styles.chatList}>
          {chats.map(chat => (
            <View key={chat.id} style={styles.chatItem}>
              <TouchableOpacity
                style={styles.chatInfo}
                onPress={() => openChat(chat)}>
                <Text style={styles.chatTitle}>
                  {editingChatId === chat.id ? (
                    <TextInput
                      style={styles.editInput}
                      value={editedTitle}
                      onChangeText={setEditedTitle}
                      onSubmitEditing={() => submitTitleChange(chat.id)}
                      onBlur={() => submitTitleChange(chat.id)}
                    />
                  ) : (
                    chat.title
                  )}
                </Text>
                <Text style={styles.chatDate}>
                  {new Date(chat.created_at).toLocaleString()}
                </Text>
              </TouchableOpacity>
              <View style={styles.chatActions}>
                {editingChatId !== chat.id && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => startEditing(chat)}>
                    <Text style={styles.actionText}>Rename</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => deleteChat(chat.id)}>
                  <Text style={[styles.actionText, {color: '#FF4444'}]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {chats.length === 0 && (
            <Text style={styles.noChatsText}>
              No chats found. Start a conversation!
            </Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000000'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    height: 60,
    backgroundColor: '#000000',
  },
  backButton: {padding: 8},
  backButtonText: {color: '#FFFFFF', fontSize: 16},
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    marginLeft: 10,
  },
  loader: {marginTop: 50},
  chatList: {paddingHorizontal: 20, paddingBottom: 40},
  chatItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatInfo: {flex: 1},
  chatTitle: {color: '#FFFFFF', fontSize: 18, fontWeight: '500'},
  chatDate: {color: '#888888', fontSize: 14, marginTop: 4},
  chatActions: {flexDirection: 'row', alignItems: 'center', marginLeft: 10},
  actionButton: {marginLeft: 10},
  actionText: {color: '#007AFF', fontSize: 16},
  editInput: {
    color: '#FFFFFF',
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
    padding: 0,
  },
  noChatsText: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },
});
