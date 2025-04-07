// jest-setup.js

// Activate fake timers so asynchronous animation timers are controlled
jest.useFakeTimers();

// Import the gesture handler setup for react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup';

// Import Animated from react-native and override its methods using Object.defineProperty
import { Animated } from 'react-native';

// Override Animated.sequence
Object.defineProperty(Animated, 'sequence', {
  value: (animations) => ({
    start: (callback) => {
      animations.forEach((anim) => {
        if (anim && typeof anim.start === 'function') {
          anim.start();
        }
      });
      if (callback) callback();
    },
  }),
  writable: true,
});

// Override Animated.parallel
Object.defineProperty(Animated, 'parallel', {
  value: (animations) => ({
    start: (callback) => {
      animations.forEach((anim) => {
        if (anim && typeof anim.start === 'function') {
          anim.start();
        }
      });
      if (callback) callback();
    },
  }),
  writable: true,
});

// Override Animated.timing
Object.defineProperty(Animated, 'timing', {
  value: (value, config) => ({
    start: (callback) => {
      value.setValue(config.toValue);
      if (callback) callback();
    },
  }),
  writable: true,
});

// Override Animated.spring
Object.defineProperty(Animated, 'spring', {
  value: (value, config) => ({
    start: (callback) => {
      value.setValue(config.toValue);
      if (callback) callback();
    },
  }),
  writable: true,
});
