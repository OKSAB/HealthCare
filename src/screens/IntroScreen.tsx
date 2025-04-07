import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
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
      Animated.delay(500),
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
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>HealthCare</Text>
        </View>
        <Text style={styles.title}>Welcome to HealthCare</Text>
        <Text style={styles.subtitle}>
          ChatDoctor: A Medical Chat Model Fine-tuned on LLaMA Model using
          Medical Domain Knowledge
        </Text>
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
  content: {alignItems: 'center'},
  logoContainer: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: '#333',
    borderRadius: width * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {color: '#FFFFFF', fontSize: 32, fontWeight: 'bold'},
  title: {color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginBottom: 10},
  subtitle: {color: '#FFFFFF', fontSize: 16, opacity: 0.8, textAlign: 'center'},
});

export default IntroScreen;
