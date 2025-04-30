import {borderRadius, colors, fontSize, spacing} from '../styles/base';
import StyledText from './Text';

type Props = {
  status: string;
  isPunchOutGreater?: boolean;
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
      case 'Expired':
        return colors.error;
      default:
        return colors.accent;
    }
  };
  return (
    <StyledText
      text={status}
      fontSize={fontSize.h5}
      style={{
        backgroundColor: getStatusColor(status),
        color: colors.white,
        textAlignVertical: 'center',
        paddingHorizontal: spacing.medium,
        paddingVertical: spacing.small,
        borderRadius: borderRadius.large,
      }}
    />
  );
};

export default Badge;
