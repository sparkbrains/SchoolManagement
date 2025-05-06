export type TimeTable = {
  columns: string[];
  rows: string[];
  detailedInfo: {
    inTime: string;
    outTime: string;
    late: string;
    early: string;
  }[];
};
