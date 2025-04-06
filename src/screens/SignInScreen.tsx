import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../context/AuthContext';

type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Dashboard: undefined;
};

type SignInScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignIn'
>;

interface SignInScreenProps {
  navigation: SignInScreenNavigationProp;
}

const {width, height} = Dimensions.get('window');

const SignInScreen: React.FC<SignInScreenProps> = ({navigation}) => {
  const {setUserEmail} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/signin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || 'Sign in failed');
      } else {
        // Sign in success: store email globally and navigate
        setUserEmail(email);
        navigation.replace('Dashboard');
      }
    } catch (err) {
      setError('Network error or server down');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#666"
                placeholder="Enter your email"
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#666"
                placeholder="Enter your password"
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.disabledButton]}
              onPress={handleSignIn}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.signInButtonText}>SIGN IN</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
              disabled={isLoading}>
              <Text style={styles.signUpButtonText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000000'},
  keyboardAvoidView: {flex: 1},
  scrollContainer: {flexGrow: 1, justifyContent: 'center', minHeight: height},
  formContainer: {
    paddingHorizontal: width * 0.06,
    width: '100%',
    justifyContent: 'center',
  },
  inputContainer: {marginBottom: height * 0.03},
  label: {
    color: '#FFFFFF',
    fontSize: Math.min(width * 0.04, 16),
    marginBottom: height * 0.01,
  },
  input: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: width * 0.04,
    color: '#FFFFFF',
    fontSize: Math.min(width * 0.04, 16),
    height: height * 0.06,
  },
  signInButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  signUpButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    height: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  signInButtonText: {
    color: '#000000',
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '600',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '600',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  disabledButton: {opacity: 0.7},
});

export default SignInScreen;
