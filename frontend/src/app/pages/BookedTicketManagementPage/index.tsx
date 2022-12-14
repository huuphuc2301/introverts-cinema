import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useGetMessage } from 'queries/message';
import useStyles from './styles';
import { Box, Chip } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from '@mui/x-data-grid';
import { useGetTickets, useGetTicketsPagination } from 'queries/tickets';
import { formatDate, formatHour } from 'utils/date';
import { fullDigit } from 'utils/number';

export default function BookedTicketManagementPage() {
  const classes = useStyles();
  const [pageState, setPageState] = useState({
    isLoading: false,
    rows: [],
    count: 0,
    pageSize: 20,
    page: 0,
  });

  const { data, isLoading } = useGetTickets();

  console.log(data);

  useEffect(() => {
    if (data !== undefined) {
      setPageState({
        ...pageState,
        count: data?.count,
        rows: data?.rows.map((row: any, index: any) => {
          return {
            id: row.id,
            filmTitle: row.Film?.title,
            startDateTime: formatDate(new Date(row.time)),
            startHourTime: formatHour(new Date(row.time)),
            roomName: row.room,
            setCode: row.seatCode,
            price: row.price.toLocaleString() + ' VNĐ',
            createdAt:
              formatHour(new Date(row.createdAt)) +
              ' ' +
              formatDate(new Date(row.createdAt)),
            filmDuration: row.Film?.duration + ' phút',
          };
        }),
      });
    }
  }, [data]);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Mã vé',
      width: 110,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: params => {
        return 'TK' + fullDigit(params.value, 6).toString();
      },
    },
    {
      field: 'filmTitle',
      headerName: 'Tên phim',
      width: 280,
      headerAlign: 'center',
    },
    {
      field: 'roomName',
      headerName: 'Tên phòng chiếu',
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'startHourTime',
      headerName: 'Giờ chiếu',
      width: 220,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'startDateTime',
      headerName: 'Ngày chiếu',
      width: 220,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'filmDuration',
      headerName: 'Thời lượng',
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'createdAt',
      headerName: 'Thời gian tạo',
      width: 180,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<string>) => {
        return params.value === 'active' ? (
          <Chip label="Còn hiệu lực" variant="outlined" color="success" />
        ) : (
          <Chip label="Hết hiệu lực" variant="outlined" color="error" />
        );
      },
    },
  ];

  return (
    <Box className={classes.roomTable}>
      <DataGrid
        autoHeight
        page={pageState.page}
        pageSize={pageState.pageSize}
        loading={isLoading}
        onPageChange={newPage => setPageState({ ...pageState, page: newPage })}
        onPageSizeChange={newPageSize =>
          setPageState({ ...pageState, pageSize: newPageSize })
        }
        rowsPerPageOptions={[10, 30, 50]}
        rowCount={pageState.count}
        rows={pageState.rows}
        disableSelectionOnClick
        columns={columns}
      />
    </Box>
  );
}
