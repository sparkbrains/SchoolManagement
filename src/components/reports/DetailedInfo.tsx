import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  data: {
    className: string;
    classTime: string;
    punchInTime: string;
    punchOutTime: string;
    arrivalStatus: string;
    exitStatus: string;
    punchInPhoto: string;
    punchOutPhoto: string;
  };
};

const DetailedInfo: React.FC<Props> = ({data}) => {
  const handlePhotoView = (photoUrl: string) => {
    Alert.alert('Photo Viewer', `Here is the photo: ${photoUrl}`, [
      {text: 'Close'},
    ]);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{data.className}</Text>
      <Text style={styles.detail}>Class Time: {data.classTime}</Text>
      <Text style={styles.detail}>Punch In: {data.punchInTime}</Text>
      <Text style={styles.detail}>Punch Out: {data.punchOutTime}</Text>
      <Text style={styles.detail}>{data.arrivalStatus}</Text>
      <Text style={styles.detail}>{data.exitStatus}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handlePhotoView(data.punchInPhoto)}>
          <Text style={styles.linkButton}>👁️ View Punch In Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePhotoView(data.punchOutPhoto)}>
          <Text style={styles.linkButton}>👁️ View Punch Out Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkButton: {
    color: '#007bff',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});

export default DetailedInfo;
