import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {colors, fontSize, spacing} from '../../styles/base';
import StyledText from '../Text';
import {TimeTable} from '../../types/types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UploadedImage from '../home/UploadedImage';

const Table = ({children}: {children: React.ReactNode}) => {
  return (
    <ScrollView style={styles.container} horizontal>
      {children}
    </ScrollView>
  );
};

const TableRow = ({
  children,
  isHeader = false,
}: {
  children: React.ReactNode;
  isHeader?: boolean;
}) => {
  return (
    <View style={[styles.row, isHeader && styles.headerRow]}>{children}</View>
  );
};

const TableCell = ({
  children,
  width = 100,
  isHeader = false,
}: {
  children: React.ReactNode;
  width?: number;
  isHeader?: boolean;
}) => {
  return (
    <View style={[styles.cell, {width}, isHeader && styles.headerCell]}>
      {children}
    </View>
  );
};

const ScheduleTable: React.FC<TimeTable> = ({columns, rows, detailedInfo}) => {
  const [showImagePreview, setShowImagePreview] = useState(false);
  return (
    <>
      <Table>
        <View>
          <TableRow isHeader>
            <TableCell width={150} isHeader>
              <StyledText
                style={[styles.cellText, styles.headerText]}
                text="Date"
                fontSize={fontSize.h5}
              />
            </TableCell>
            {columns.map((slot, index) => (
              <TableCell key={index} width={200} isHeader>
                <StyledText
                  style={[styles.cellText, styles.headerText]}
                  text={slot}
                  fontSize={fontSize.h5}
                />
              </TableCell>
            ))}
          </TableRow>

          {rows.map((date, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell width={150}>
                <StyledText
                  fontSize={fontSize.h5}
                  text={date}
                  style={styles.cellText}
                />
              </TableCell>

              {detailedInfo.map((info, colIndex) => (
                <TableCell key={colIndex} width={200}>
                  <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                      <Icon
                        name="access-time"
                        size={18}
                        color={colors.primary}
                      />
                      <View style={styles.textAndIconContainer}>
                        <StyledText
                          fontSize={fontSize.h5}
                          text={`In Time: ${info.inTime}`}
                          style={styles.infoText}
                        />
                        <TouchableOpacity
                          style={styles.iconButton}
                          onPress={() => setShowImagePreview(true)}>
                          <Icon
                            name={'visibility'}
                            size={16}
                            color={colors.white}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.infoRow}>
                      <Icon
                        name="exit-to-app"
                        size={18}
                        color={colors.primary}
                      />
                      <View style={styles.textAndIconContainer}>
                        <StyledText
                          fontSize={fontSize.h5}
                          text={`Out Time: ${info.outTime}`}
                          style={styles.infoText}
                        />
                        <TouchableOpacity
                          style={styles.iconButton}
                          onPress={() => setShowImagePreview(true)}>
                          <Icon
                            name={'visibility'}
                            size={16}
                            color={colors.white}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.infoRow}>
                      <Icon name="timer-off" size={18} color="red" />
                      <StyledText
                        fontSize={fontSize.h5}
                        text={`Late: ${info.late} mins`}
                        style={[styles.infoText, {color: 'red'}]}
                      />
                    </View>

                    <View style={styles.infoRow}>
                      <Icon name="timer" size={18} color="green" />
                      <StyledText
                        fontSize={fontSize.h5}
                        text={`Early: ${info.early} mins`}
                        style={[styles.infoText, {color: 'green'}]}
                      />
                    </View>
                  </View>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </View>
      </Table>
      <UploadedImage
        visible={showImagePreview}
        onRequestClose={() => setShowImagePreview(false)}
        imageUrl={
          'https://images.unsplash.com/photo-1742522314620-a41c790acbdb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.medium,
  },
  textAndIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.medium,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  infoText: {
    marginLeft: spacing.small,
    fontSize: fontSize.h5,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.small,
    padding: spacing.small,
    backgroundColor: colors.background,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoText: {
    marginLeft: spacing.small,
    color: colors.primary,
    fontSize: fontSize.h5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    backgroundColor: colors.background,
  },
  cell: {
    padding: spacing.small,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  headerCell: {
    backgroundColor: colors.background,
  },
  cellText: {
    fontSize: fontSize.h5,
  },
  headerText: {
    fontSize: fontSize.h4,
    fontWeight: 'bold',
  },
});

export default ScheduleTable;
