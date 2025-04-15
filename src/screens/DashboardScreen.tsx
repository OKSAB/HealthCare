import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {UserCircle, User, Clock, LogOut, Send} from 'lucide-react-native';
import {useAppData} from '../context/AppData';
import {useAuth} from '../context/AuthContext';
import {config} from '../../config';

type RootStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  SignIn: undefined;
  History: undefined;
};

type DashboardScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
}

interface Message {
  chat_type: 'Prompt' | 'Response';
  text: string;
}

const {height} = Dimensions.get('window');

const DashboardScreen: React.FC<DashboardScreenProps> = ({navigation}) => {
  const {activeConversation, updateConversations, setActiveConversation} =
    useAppData();
  const {userId} = useAuth();
  const {api} = config;
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const [messages, setMessages] = useState(activeConversation);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const toggleMenu = () => {
    const toValue = isMenuVisible ? 0 : 1;
    setIsMenuVisible(!isMenuVisible);
    Animated.spring(menuAnimation, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  const closeMenu = () => {
    Animated.spring(menuAnimation, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start(() => setIsMenuVisible(false));
  };

  const menuTranslateY = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });
  const menuOpacity = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      navigation.replace('SignIn');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistory = () => {
    closeMenu();
    navigation.navigate('History');
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) {
      Alert.alert('Please enter a message.');
      return;
    }
    const userMessage: Message = {chat_type: 'Prompt', text: inputText.trim()};
    setInputText('');
    scrollViewRef.current?.scrollToEnd({animated: true});
    try {
      const response = await fetch(`${api}/prompt`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          text: userMessage.text,
          conversation_id: messages?.id,
          user_id: userId,
        }),
      });
      if (!response.ok) {
        throw new Error('Server error: ' + response.status);
      }
      const data = await response.json();

      updateConversations(data);
      // setActiveConversation(data.id)
      // const systemMessage: Message = {chat_type: 'Response', text: data.answer};
      setMessages(data);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
    } catch (error) {
      Alert.alert('Error', 'Failed to get an answer. Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.profileIcon}
              onPress={toggleMenu}
              activeOpacity={0.7}>
              <UserCircle size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Animated.View
              style={[
                styles.dropdownMenu,
                isMenuVisible ? styles.dropdownVisible : styles.dropdownHidden,
                {
                  opacity: menuOpacity,
                  transform: [{translateY: menuTranslateY}],
                },
              ]}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  closeMenu();
                  navigation.navigate('Profile');
                }}>
                <User size={20} color="#FFFFFF" />
                <Text style={styles.menuText}>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleHistory}>
                <Clock size={20} color="#FFFFFF" />
                <Text style={styles.menuText}>History</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleLogout}
                disabled={isLoading}>
                <LogOut size={20} color="#FF4444" />
                <Text style={[styles.menuText, styles.logoutText]}>
                  {isLoading ? 'Logging out...' : 'Log Out'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Chat Conversation Area */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          ref={scrollViewRef}>
          {messages &&
            messages?.chats &&
            messages?.chats.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.chat_type === 'Prompt'
                    ? styles.userBubble
                    : styles.systemBubble,
                ]}>
                <Text
                  style={
                    msg.chat_type === 'Prompt'
                      ? styles.userText
                      : styles.systemText
                  }>
                  {msg.text}
                </Text>
              </View>
            ))}
        </ScrollView>

        {/* Input Field Section */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Describe your symptoms..."
            placeholderTextColor="#666"
            value={inputText}
            onChangeText={setInputText}
            multiline={false}
            textAlignVertical="center"
            numberOfLines={1}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            activeOpacity={0.7}>
            <Send size={20} color="#FFFFFF" style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000000'},
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    height: height * 0.08,
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 60,
    left: 0,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownVisible: {display: 'flex'},
  dropdownHidden: {display: 'none'},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  menuText: {color: '#FFFFFF', marginLeft: 12, fontSize: 16},
  logoutText: {color: '#FF4444'},
  messagesContainer: {flex: 1, padding: 20},
  messagesContent: {paddingBottom: 20},
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userBubble: {backgroundColor: '#DCF8C6', alignSelf: 'flex-end'},
  systemBubble: {backgroundColor: '#FFFFFF', alignSelf: 'flex-start'},
  userText: {color: '#000000'},
  systemText: {color: '#000000'},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingRight: 50,
    color: '#FFFFFF',
    fontSize: 16,
    textAlignVertical: 'center',
    includeFontPadding: false,
    textAlign: 'left',
    lineHeight: 20,
  },
  sendButton: {
    position: 'absolute',
    right: 28,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotate: '45deg'}],
  },
  sendIcon: {marginLeft: -2, marginTop: -2},
});

export default DashboardScreen;
