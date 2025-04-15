import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAppData} from '../context/AppData';
import {config} from '../../config';

type RootStackParamList = {
  History: undefined;
  Dashboard: undefined;
};

type HistoryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'History'
>;

interface HistoryScreenProps {
  navigation: HistoryScreenNavigationProp;
}

interface Chat {
  id: number;
  title: string;
  created_at: string;
  messages: Array<{sender: string; text: string}>;
}

const {width} = Dimensions.get('window');

const HistoryScreen: React.FC<HistoryScreenProps> = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {api} = config;
  const {chats, deleteConversation, setActiveConversation} = useAppData();

  // const fetchChats = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch('http://127.0.0.1:8000/chats');
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch chats');
  //     }
  //     const data = await response.json();
  //     setChats(data);
  //   } catch (error: any) {
  //     Alert.alert('Error', error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchChats();
  // }, [fetchChats]);

  const handleDeleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`${api}/conversation/${chatId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }
      deleteConversation(chatId);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    try {
      const response = await fetch(`${api}/chats/${chatId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title: newTitle}),
      });
      if (!response.ok) {
        throw new Error('Failed to rename chat');
      }
      // fetchChats();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat History</Text>
        {/* Empty view for alignment */}
        <View style={styles.backButton} />
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : (
        <ScrollView contentContainerStyle={styles.chatList}>
          {chats &&
            chats.map(chat => (
              <TouchableOpacity
                key={chat.id}
                style={styles.chatItem}
                onPress={() => {
                  setActiveConversation(chat.id);
                  navigation.navigate('Dashboard');
                }}>
                <Text style={styles.chatTitle}>{chat.title}</Text>
                {/* <Text style={styles.chatDate}>{chat.created_at}</Text> */}
                <View style={styles.chatActions}>
                  <TouchableOpacity
                    onPress={() => handleRenameChat(chat.id, 'New Title')}>
                    <Text style={styles.actionText}>Rename</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteChat(chat.id)}>
                    <Text style={[styles.actionText, styles.deleteText]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000000', padding: 20},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.06,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    height: 60,
  },
  backButton: {padding: 10},
  backText: {color: '#FFF', fontSize: 16},
  headerTitle: {color: '#FFFFFF', fontSize: 20, fontWeight: '600'},
  chatList: {paddingBottom: 20},
  chatItem: {
    backgroundColor: '#1A1A1A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  chatTitle: {color: '#FFFFFF', fontSize: 18, marginBottom: 5},
  chatDate: {color: '#AAAAAA', fontSize: 14},
  chatActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionText: {color: '#007AFF', fontSize: 16},
  deleteText: {color: '#FF4444'},
});

export default HistoryScreen;
