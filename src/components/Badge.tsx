import {borderRadius, colors, fontSize, spacing} from '../styles/base';
import StyledText from './Text';

type Props = {
  status: string;
};

const Badge: React.FC<Props> = ({status}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Punched In':
        return colors.success;
      case 'Punched Out':
        return colors.success;
      case 'Not Started':
        return colors.accent;
      case 'Marked Absent':
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
