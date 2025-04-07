/* global jest */
import 'react-native-gesture-handler/jestSetup';

jest.useFakeTimers();

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
      if (callback) {
        callback();
      }
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
      if (callback) {
        callback();
      }
    },
  }),
  writable: true,
});

// Override Animated.timing
Object.defineProperty(Animated, 'timing', {
  value: (value, config) => ({
    start: (callback) => {
      value.setValue(config.toValue);
      if (callback) {
        callback();
      }
    },
  }),
  writable: true,
});

// Override Animated.spring
Object.defineProperty(Animated, 'spring', {
  value: (value, config) => ({
    start: (callback) => {
      value.setValue(config.toValue);
      if (callback) {
        callback();
      }
    },
  }),
  writable: true,
});
