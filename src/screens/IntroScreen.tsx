import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  Intro: undefined;
  SignIn: undefined;
};

type IntroScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignIn'
>;

interface IntroScreenProps {
  navigation: IntroScreenNavigationProp;
}

const {width, height} = Dimensions.get('window');

const IntroScreen: React.FC<IntroScreenProps> = ({navigation}) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations in sequence
    Animated.sequence([
      // Fade in and scale up the logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      // Wait for a moment
      Animated.delay(500),
      // Move everything up and fade out
      Animated.parallel([
        Animated.timing(moveAnim, {
          toValue: -height / 3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Navigate to SignIn screen after animation
      navigation.replace('SignIn');
    });
  }, [fadeAnim, scaleAnim, moveAnim, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}, {translateY: moveAnim}],
          },
        ]}>
        {/* Replace this with your app logo/icon */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>APP</Text>
        </View>
        <Text style={styles.title}>MyDoctor</Text>
        <Text style={styles.subtitle}>YOUR OWN AI DOCTOR</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: '#333',
    borderRadius: width * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.8,
  },
});

export default IntroScreen;
