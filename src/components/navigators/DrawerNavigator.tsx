import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {RootStackParamList} from '../../types/screen-props';
import HomeScreen from '../../screens/HomeScreen';
import CameraView from '../../screens/CameraView';
import Reports from '../../screens/Reports';

const Drawer = createDrawerNavigator<RootStackParamList>();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {/* <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.closeDrawer()}
      /> */}
    </DrawerContentScrollView>
  );
}

function DrawerNavigator(): React.JSX.Element {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName="Home"
      screenOptions={({route}) => ({
        swipeEnabled: route.name !== 'CameraView',
        drawerLockMode:
          route.name === 'CameraView' ? 'locked-closed' : 'unlocked',
      })}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Reports" component={Reports} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
