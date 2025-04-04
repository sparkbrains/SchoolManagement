import {Permission, PermissionsAndroid, Platform} from 'react-native';

// Example usage:
// checkPermission(['notification', 'camera', 'microphone' ...and more as required] )

type PermissionType = 'camera'; // Add more in case any other permission is required
type PermissionStatusResult = 'ALLOWED' | 'REJECTED' | 'NEVER_ASK_AGAIN';

const permissionsMap: {[key in PermissionType]?: string[]} = {
  camera: [PermissionsAndroid.PERMISSIONS.CAMERA],
};

export const checkPermission = async (
  types: PermissionType | PermissionType[],
): Promise<PermissionStatusResult> => {
  if (Platform.OS !== 'android') {
    return 'ALLOWED'; // Add permissions for IOS devices
  }

  const permissionTypes = Array.isArray(types) ? types : [types];

  const permissionsToCheck = permissionTypes.flatMap(
    type => permissionsMap[type] || [],
  );

  if (permissionsToCheck.length === 0) {
    console.warn(`No permissions defined for types: ${JSON.stringify(types)}`);
    return 'ALLOWED';
  }

  try {
    const grantedPermissions = await Promise.all(
      permissionsToCheck.map(async permission => ({
        permission,
        granted: await PermissionsAndroid.check(permission as Permission),
      })),
    );

    const permissionsToRequest = grantedPermissions
      .filter(p => !p.granted)
      .map(p => p.permission);

    if (permissionsToRequest.length === 0) {
      return 'ALLOWED'; // All required permissions are already granted
    }

    // Request multiple permissions
    const requestResults = await PermissionsAndroid.requestMultiple(
      permissionsToRequest as Permission[],
    );

    let hasRejected = false;
    let hasNeverAskAgain = false;

    permissionsToRequest.forEach(perm => {
      const result = requestResults[perm as keyof typeof requestResults];
      if (result === PermissionsAndroid.RESULTS.DENIED) {
        hasRejected = true;
      } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        hasNeverAskAgain = true;
      }
    });

    if (hasNeverAskAgain) return 'NEVER_ASK_AGAIN';
    if (hasRejected) return 'REJECTED';

    return 'ALLOWED';
  } catch (err) {
    console.error('Error checking permissions:', err);
    return 'REJECTED';
  }
};
