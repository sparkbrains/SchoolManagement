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
                  <View>
                    <StyledText
                      fontSize={fontSize.h5}
                      text={`In Time: ${info.inTime}`}
                      style={styles.cellText}
                    />
                    <StyledText
                      fontSize={fontSize.h5}
                      text={`Out Time: ${info.outTime}`}
                      style={styles.cellText}
                    />
                    <StyledText
                      fontSize={fontSize.h5}
                      text={`Late: ${info.late} mins`}
                      style={styles.cellText}
                    />
                    <StyledText
                      fontSize={fontSize.h5}
                      text={`Early: ${info.early} mins`}
                      style={styles.cellText}
                    />
                    <TouchableOpacity
                      style={styles.photoRow}
                      onPress={() => setShowImagePreview(true)}>
                      <Icon name="visibility" size={20} color={colors.primary} />
                      <StyledText
                        fontSize={fontSize.h5}
                        text="Punch In Photo"
                        style={styles.photoText}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.photoRow}
                      onPress={() => setShowImagePreview(true)}>
                      <Icon name="visibility" size={20} color={colors.primary} />
                      <StyledText
                        fontSize={fontSize.h5}
                        text="Punch Out Photo"
                        style={styles.photoText}
                      />
                    </TouchableOpacity>
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
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.small,
  },
  photoText: {
    marginLeft: spacing.small,
    color: colors.primary,
  },
});

export default ScheduleTable;
