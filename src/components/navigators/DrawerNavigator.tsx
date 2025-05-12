import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {RootStackParamList} from '../../types/screen-props';
import HomeScreen from '../../screens/HomeScreen';
import CameraView from '../../screens/CameraView';
import Reports from '../../screens/Reports';

const Drawer = createDrawerNavigator<RootStackParamList>();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const {state, ...rest} = props;
  const newState = {
    ...state,
    routes: state.routes.filter(route => route.name !== 'CameraView'),
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...rest} state={newState} />
    </DrawerContentScrollView>
  );
}

function DrawerNavigator(): React.JSX.Element {
  return (
    <Drawer.Navigator
      // drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName="Home"
      screenOptions={({route}) => ({
        swipeEnabled: route.name !== 'CameraView',
        drawerLockMode:
          route.name === 'CameraView' ? 'locked-closed' : 'unlocked',
      })}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Reports" component={Reports} />
      <Drawer.Screen
        name="CameraView"
        component={CameraView}
        options={{
          drawerItemStyle: {display: 'none'},
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
