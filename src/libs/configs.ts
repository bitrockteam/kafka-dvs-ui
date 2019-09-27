export const queryChart = {
  chart: {
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 2000,
      },
    },
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },
  title: {
    text: 'Custom RSVPs data',
    align: 'left',
  },
  markers: {
    size: 0,
  },
  xaxis: {
    type: 'datetime',
    range: 10000,
  },
  // yaxis: {
  //   max: 100,
  // },
  legend: {
    show: false,
  },
};
