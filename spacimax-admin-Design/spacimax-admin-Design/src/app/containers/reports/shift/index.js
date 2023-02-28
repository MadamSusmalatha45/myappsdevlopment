import React from "react";
import { Box  } from "@mui/material";
import PageTitle from "../../../common/PageTitle";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  import {faker} from '@faker-js/faker';
// import { blue } from '@mui/material/colors';
// import AddCircleIcon from '@mui/icons-material/AddCircle';

import "./style.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export default function ShiftReportPage() {
    const options = {
        responsive: true,
        layout: {
            // padding: {
            //     top: 5,
            //     left: 15,
            //     right: 15,
            //     bottom: 15
            // }
            height : 400,
            fontSize : 18
        },
        plugins: {
          legend: {
            position: 'bottom' ,
          },
          title: {
            display: true,
            text: 'Shift Completion Report',
          },
        },
    };

    const optionsCasual = {
    responsive: true,
    layout: {
        // padding: {
        //     top: 5,
        //     left: 15,
        //     right: 15,
        //     bottom: 15
        // }
        height : 400,
        fontSize : 18
    },
    plugins: {
        legend: {
        position: 'bottom' ,
        },
        title: {
        display: true,
        text: 'Check in Completion Report',
        },
    },
    };
    const labels = ['Jan - 22', 'Feb - 22', 'Mar - 22', 'Apr - 22', 'May - 22', 'Jun - 22', 'Jul - 22', 'Aug - 22', 'Sep - 22', 'Oct - 22'];
   
    const data = {
        labels,
        datasets: [
          {
            label: 'Booked Hours',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 70 })),
            backgroundColor: '#2896E9',
          },
          {
            label: 'Actual Hours',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 70 })),
            backgroundColor: '#F36F4E',
          },
          {
            label: 'Lost Time',
            data: labels.map(() => faker.datatype.number({ min: 0, max: 70 })),
            backgroundColor: '#8091AA',
          }
        ],
    };


    const dataCasual = {
    labels,
    datasets: [
        {
        label: 'Booked Hours',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 70 })),
        backgroundColor: '#2896E9',
        },
        {
        label: 'Actual Hours',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 70 })),
        backgroundColor: '#F36F4E',
        },
        {
        label: 'Lost Time',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 70 })),
        backgroundColor: '#8091AA',
        },
    ],
    };
    
  return (
    <Box sx={{ height: "inherit" }}>
      <PageTitle title="Reports"  subTitle="Portfolio Reports"/>
      <Box display="flex" sx={{  mx : "0.5rem", p : "1rem" }} className="bar-box">
        <Bar options={options} data={data} className="bar-chart"/>
      </Box>

      <Box display="flex" sx={{  mx : "0.5rem", p : "1rem" }} className="bar-box">
        <Bar options={optionsCasual} data={dataCasual} className="bar-chart"/>
      </Box>
    </Box>
  );
}


