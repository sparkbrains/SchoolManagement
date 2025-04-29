// import {borderRadius, colors, fontSize, spacing} from '../styles/base';
// import StyledText from './Text';

// type Props = {
//   status: string;
//   isPunchOutGreater?: boolean;
// };

// const Badge: React.FC<Props> = ({status, isPunchOutGreater}) => {
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Upcoming':
//         return colors.info;
//       case 'Ongoing':
//         return colors.accent;
//       case 'Completed':
//         if (isPunchOutGreater) {
//           return colors.error;
//         }
//         return colors.success;
//       case 'Cancelled':
//         return colors.error;
//       case 'Absent':
//         return colors.error;
//       default:
//         return colors.accent;
//     }
//   };
//   return (
//     <StyledText
//       text={status}
//       fontSize={fontSize.h5}
//       style={{
//         backgroundColor: getStatusColor(status),
//         color: colors.white,
//         textAlignVertical: 'center',
//         paddingHorizontal: spacing.medium,
//         paddingVertical: spacing.small,
//         borderRadius: borderRadius.large,
//       }}
//     />
//   );
// };

// export default Badge;

import {View} from 'react-native';
import {colors, spacing} from '../styles/base';

type Props = {
  status: string;
  isValid?: boolean;
};

const Badge: React.FC<Props> = ({status, isValid}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return colors.info;
      case 'Ongoing':
        return colors.accent;
      case 'Completed':
        return isValid ? colors.success : colors.error;
      case 'Cancelled':
        return colors.error;
      case 'Absent':
        return colors.error;
      default:
        return colors.accent;
    }
  };

  return (
    <View
      style={{
        backgroundColor: getStatusColor(status),
        width: 14,
        height: 14,
        borderRadius: 99,
        marginHorizontal: spacing.small,
      }}
    />
  );
};

export default Badge;
