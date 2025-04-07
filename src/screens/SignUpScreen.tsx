import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../context/AuthContext';

type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Dashboard: undefined;
};

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

const {width, height} = Dimensions.get('window');

const SignUpScreen: React.FC<SignUpScreenProps> = ({navigation}) => {
  const {setUserEmail} = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    height: '',
    heightUnit: 'FT',
    weight: '',
    weightUnit: 'KG',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateDecimalNumber = (value: string): boolean => {
    const regex = /^\d*\.?\d*$/;
    return regex.test(value);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    return hasUpperCase && hasNumber && hasMinLength;
  };

  const formatDOB = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(
        2,
        4,
      )}/${cleaned.slice(4, 8)}`;
    } else if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    setFormData({...formData, dob: formatted});
  };

  const handleNumberInput = (text: string, field: 'height' | 'weight') => {
    if (validateDecimalNumber(text) || text === '') {
      setFormData({...formData, [field]: text});
      if (errors[field]) {
        setErrors({...errors, [field]: ''});
      }
    }
  };

  // For Height and Weight unit, we want to keep the registered unit unchanged, so we use a no-op in the onPress.

  const handleSignUp = async () => {
    const newErrors: {[key: string]: string} = {};
    setIsLoading(true);
    if (!formData.firstName) {newErrors.firstName = 'First name is required';}
    if (!formData.lastName) {newErrors.lastName = 'Last name is required';}
    if (!formData.dob || formData.dob.length !== 10)
      {newErrors.dob = 'Valid date required (MM/DD/YYYY)';}
    if (!formData.height) {
      newErrors.height = 'Height is required';
    } else if (!validateDecimalNumber(formData.height)) {
      newErrors.height = 'Height must be a valid number';
    } else if (parseFloat(formData.height) <= 0) {
      newErrors.height = 'Height must be greater than 0';
    }
    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (!validateDecimalNumber(formData.weight)) {
      newErrors.weight = 'Weight must be a valid number';
    } else if (parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Valid email required';
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must have 8+ chars, 1 uppercase, 1 number';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const heightStr = `${formData.height} ${formData.heightUnit}`;
        const weightStr = `${formData.weight} ${formData.weightUnit}`;
        const response = await fetch('http://127.0.0.1:8000/signup', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            first_name: formData.firstName,
            last_name: formData.lastName,
            dob: formData.dob,
            height: heightStr,
            weight: weightStr,
          }),
        });
        if (!response.ok) {
          const data = await response.json();
          setErrors({...newErrors, submit: data.detail || 'Failed to sign up'});
        } else {
          Alert.alert('Success', 'Signed up successfully!');
          setUserEmail(formData.email);
          navigation.replace('Dashboard');
        }
      } catch (error: any) {
        setErrors({...newErrors, submit: 'Network error or server is down'});
      }
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. John"
                placeholderTextColor="#666"
                value={formData.firstName}
                onChangeText={text =>
                  setFormData({...formData, firstName: text})
                }
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Doe"
                placeholderTextColor="#666"
                value={formData.lastName}
                onChangeText={text =>
                  setFormData({...formData, lastName: text})
                }
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#666"
                value={formData.dob}
                onChangeText={formatDOB}
                maxLength={10}
                keyboardType="numeric"
              />
              {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Height</Text>
              <View style={styles.measurementContainer}>
                <TextInput
                  style={styles.measurementInput}
                  placeholder={`Height in ${formData.heightUnit}`}
                  placeholderTextColor="#666"
                  value={formData.height}
                  onChangeText={text => handleNumberInput(text, 'height')}
                  keyboardType="decimal-pad"
                />
                <TouchableOpacity style={styles.unitButton} onPress={() => {}}>
                  <Text style={styles.unitButtonText}>
                    {formData.heightUnit}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.height && (
                <Text style={styles.errorText}>{errors.height}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Weight</Text>
              <View style={styles.measurementContainer}>
                <TextInput
                  style={styles.measurementInput}
                  placeholder={`Weight in ${formData.weightUnit}`}
                  placeholderTextColor="#666"
                  value={formData.weight}
                  onChangeText={text => handleNumberInput(text, 'weight')}
                  keyboardType="decimal-pad"
                />
                <TouchableOpacity style={styles.unitButton} onPress={() => {}}>
                  <Text style={styles.unitButtonText}>
                    {formData.weightUnit}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.weight && (
                <Text style={styles.errorText}>{errors.weight}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                placeholderTextColor="#666"
                value={formData.email}
                onChangeText={text => setFormData({...formData, email: text})}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#666"
                secureTextEntry
                value={formData.password}
                onChangeText={text =>
                  setFormData({...formData, password: text})
                }
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                placeholderTextColor="#666"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={text =>
                  setFormData({...formData, confirmPassword: text})
                }
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>
            {errors.submit && (
              <Text style={styles.errorText}>{errors.submit}</Text>
            )}
            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.disabledButton]}
              onPress={handleSignUp}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.signUpButtonText}>SIGN UP</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => navigation.navigate('SignIn')}
              disabled={isLoading}>
              <Text style={styles.linkText}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000000'},
  keyboardAvoidView: {flex: 1},
  scrollContainer: {flexGrow: 1, justifyContent: 'center', minHeight: height},
  formContainer: {
    paddingHorizontal: width * 0.06,
    width: '100%',
    justifyContent: 'center',
  },
  inputContainer: {marginBottom: height * 0.02},
  label: {
    color: '#FFFFFF',
    fontSize: Math.min(width * 0.04, 16),
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: width * 0.04,
    color: '#FFFFFF',
    fontSize: Math.min(width * 0.04, 16),
    height: height * 0.06,
  },
  signUpButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: height * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.04,
  },
  signUpButtonText: {
    color: '#000000',
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '600',
  },
  disabledButton: {opacity: 0.7},
  errorText: {color: '#FF4444', fontSize: 14, marginTop: 4, textAlign: 'left'},
  measurementContainer: {flexDirection: 'row', alignItems: 'center'},
  measurementInput: {
    flex: 1,
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: width * 0.04,
    color: '#FFFFFF',
    fontSize: Math.min(width * 0.04, 16),
    height: height * 0.06,
    marginRight: 10,
  },
  unitButton: {backgroundColor: '#444', borderRadius: 8, padding: 10},
  unitButtonText: {color: '#fff', fontSize: Math.min(width * 0.04, 16)},
  linkContainer: {marginTop: 20},
  linkText: {color: '#FFF', textAlign: 'center'},
});
