import { useEffect, useReducer } from 'react';
import Axios from "axios";

import {
  reducer,
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "../reducers/reducerFunc";

export default function useApplicationData () {

  // ------------ STATE MANAGEMENT --------------------------- //
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  // ------------ THE SET DAY FUNCTION ---------------------- //
  const setDay = day => dispatch({type: SET_DAY, day});

  //- HAVE TO USE USE-EFFECT BECAUSE DATA IS RETRIEVED FROM API AND THEN USED TO UPDATE STATE ----- //


  // ------------ FETCHING DATA FROM API --------------------------- //
  useEffect(() => {
    const getDaysUrl = `/api/days`;
    const getAppointmentsUrl = `/api/appointments`;
    const getInterviewersUrl = `/api/interviewers`;

    const days = Axios.get(getDaysUrl);
    const appointments = Axios.get(getAppointmentsUrl);
    const interviewersList = Axios.get(getInterviewersUrl);

    Promise.all([
      days,
      appointments,
      interviewersList
    ])
    .then((response) => {
      const [daysData, appointmentsData, interviewersData] = response;
      dispatch({
        type: SET_APPLICATION_DATA,
        days: daysData.data,
        appointments: appointmentsData.data,
        interviewers: interviewersData.data
      })
    })
    .catch(e => console.error('', e))

  }, []);
/*
  const bookInterview = function (id, interview) {
    const req = {
      url: `/api/appointments/${id}`,
      method: `PUT`,
      data: {interview}
    }
    return Axios(req)
    .then(dispatch({
      type: SET_INTERVIEW, id, interview
    }))
    .catch(e => console.error(e))
  };
*/
const bookInterview = function (id, interview) {
  return (
    Axios.put(`/api/appointments/${id}`, {interview})
    .then(() => {
      dispatch({type: SET_INTERVIEW, id, interview})
    })
  )
};
/*
  const cancelInterview = function (id) {
    const req = {
      url: `/api/appointments/${id}`,
      method: `DELETE`
    }
    return Axios(req)
    .then(dispatch({ type: SET_INTERVIEW, id, interview: {} }))
  }
*/
const cancelInterview = function (id) {
  return (
    Axios.delete(`/api/appointments/${id}`)
    .then(() => {
      dispatch({type: SET_INTERVIEW, id, interview: null})
    }).catch(e => console.error(e))
  )
};

// ------------- WEB SOCKET CONNECTION SECTION ------------------ //
useEffect(() => {
  const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

  socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    dispatch(data);
  };
  return () => socket.close();
}, []);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}