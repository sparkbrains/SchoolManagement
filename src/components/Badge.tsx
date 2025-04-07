import {borderRadius, colors, fontSize, spacing} from '../styles/base';
import StyledText from './Text';

type Props = {
  status: string;
};

const Badge: React.FC<Props> = ({status}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return colors.success;
      case 'Ongoing':
        return colors.success;
      case 'Completed':
        return colors.accent;
      case 'Cancelled':
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
