import axios, { AxiosResponse } from 'axios';
import config from 'config';
import { useQuery } from 'react-query';

export const getShowtimesByMovie = async (movieId: string): Promise<any> => {
  let response: AxiosResponse<any>;
  response = await axios.get(`${config.apiEndpoint}/showtimes?film=${movieId}`);

  return response.data.data;
};

export const useGetShowtimesByMovie = (movieId: string) =>
  useQuery(
    ['showtimes/get-showtime-by-movie', movieId],
    () => getShowtimesByMovie(movieId),
    { refetchOnWindowFocus: false },
  );

export const getShowtimeDetail = async (id: string): Promise<any> => {
  let response: AxiosResponse<any>;
  response = await axios.get(`${config.apiEndpoint}/showtimes/${id}`);

  return response.data.data;
};

export const useGetShowtimeDetail = (id: string, queryOpts?: any) =>
  useQuery(['showtimes/get-detail', id], () => getShowtimeDetail(id), {
    refetchOnWindowFocus: false,
    ...queryOpts,
  });

export const getSeatsByShowtimeId = async (
  showtimeId: number,
): Promise<any> => {
  let response: AxiosResponse<any>;
  response = await axios.get(
    `${config.apiEndpoint}/seats/?showtime=${showtimeId}`,
  );

  return response.data.data;
};

export const useGetSeatsByShowtimeId = (showtimeId: number, queryOpts?: any) =>
  useQuery(['showtimes/get-detail'], () => getSeatsByShowtimeId(showtimeId), {
    refetchOnWindowFocus: false,
    ...queryOpts,
  });

export const getShowtimes = async (
  page: number,
  size: number,
): Promise<any> => {
  let response: AxiosResponse<any>;
  const token = sessionStorage.getItem('token');
  const authenticationHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    response = await axios.get(
      `${config.apiEndpoint}/showtimes/pagination?page=${page}&size=${size}`,
      authenticationHeader,
    );
  } catch (e) {
    return [];
  }
  return response.data.data;
};

export const useGetShowtimes = (page: number, size: number) =>
  useQuery(['getShowtimes', page, size], () => getShowtimes(page, size), {
    refetchOnWindowFocus: false,
  });
