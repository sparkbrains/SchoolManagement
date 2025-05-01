// import React, {useRef} from 'react';
// import {
//   View,
//   PanResponder,
//   StyleSheet,
//   Animated,
//   GestureResponderEvent,
//   PanResponderGestureState,
// } from 'react-native';

// interface SwipeableComponentProps {
//   onSwipeLeft?: () => void;
//   onSwipeRight?: () => void;
//   children: React.ReactNode;
// }

// const SwipeableComponent: React.FC<SwipeableComponentProps> = ({
//   onSwipeLeft,
//   onSwipeRight,
//   children,
// }) => {
//   const translateX = useRef(new Animated.Value(0)).current;

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderMove: (
//         evt: GestureResponderEvent,
//         gestureState: PanResponderGestureState,
//       ) => {
//         translateX.setValue(gestureState.dx);
//       },
//       onPanResponderRelease: (
//         evt: GestureResponderEvent,
//         gestureState: PanResponderGestureState,
//       ) => {
//         const {dx} = gestureState;

//         if (dx > 50 && onSwipeRight) {
//           onSwipeRight();
//         } else if (dx < -50 && onSwipeLeft) {
//           onSwipeLeft();
//         }

//         Animated.spring(translateX, {
//           toValue: 0,
//           useNativeDriver: true,
//         }).start();
//       },
//     }),
//   ).current;

//   return (
//     <View style={{flex: 1}} {...panResponder.panHandlers}>
//       <Animated.View style={[{transform: [{translateX}]}]}>
//         {children}
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({});

// export default SwipeableComponent;

import React, {useRef} from 'react';
import {
  View,
  PanResponder,
  StyleSheet,
  Animated,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';

interface SwipeableComponentProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  children: React.ReactNode;
}

const SwipeableComponent: React.FC<SwipeableComponentProps> = ({
  onSwipeLeft,
  onSwipeRight,
  children,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      // Allow gestures to start for horizontal swipes only when dx is greater than dy
      onMoveShouldSetPanResponder: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const {dx, dy} = gestureState;
        // Only set the responder for horizontal gestures if horizontal delta (dx) is greater than vertical delta (dy)
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
      },
      onPanResponderMove: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const {dx} = gestureState;
        translateX.setValue(dx);
      },
      onPanResponderRelease: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const {dx} = gestureState;

        if (dx > 50 && onSwipeRight) {
          onSwipeRight();
        } else if (dx < -50 && onSwipeLeft) {
          onSwipeLeft();
        }

        // Reset the translation back to the starting position
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <View style={{flex: 1}} {...panResponder.panHandlers}>
      <Animated.View style={[{transform: [{translateX}]}]}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default SwipeableComponent;
