<template>
  <div>
    <div class="shadow pt-2 pl-3 pr-3 pb-2 mb-5 bg-light rounded">
      <div class="row">
        <h5 class="my-auto pl-3">
          <font-awesome-icon icon="clock" class="pb-1" />
          Logs within the past
        </h5>
        <div>
          <b-dropdown id="ddown-left" :text="startPoint" variant="secondary" class="m-2">
            <b-dropdown-item v-for="option in Object.keys(startPoints)" 
                             :key="option" @click="setStartPoint(option)">
              <p class="p-0 m-0" v-if="option == startPoint"><b>{{ option }}</b></p>
              <p class="p-0 m-0" v-else>{{ option }}</p>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
      <line-chart :chart-data="datacollection" :options="chartOptions"></line-chart>
    </div>
  </div>
</template>

<script>
  import LineChart from '../config/LineChart.js';
  import ServerStore from '../stores/ServerStore.js';

  export default {
    components: {
      LineChart
    },
    data () {
      return {
        datacollection: null,
        chartOptions: null,
        startPoint: 'hour',
        startPoints: {
          '30 min': 30,
          'hour': 60,
          '2 hours': 120,
          '4 hours': 240
        },
        dataArrays: {
          info: [],
          warn: [],
          error: []
        },
        xData: [],
        activeArrays: {
          info: [],
          warn: [],
          error: []
        },
        activexData: [],
        overThreshold: {
          info: false,
          warning: false,
          error: false
        },
      }
    },
    mounted () {
      this.$socket.on('new log', (data) => {
        switch (data.logType) {
          case "INFO":
            this.addData(data, 'info');
            break;
          case "WARN":
            this.addData(data, 'warn');
            break;
          case "ERROR":
            this.addData(data, 'error');
            break;
        }
        this.fillData();
      }),
      this.init(),
      this.runClock()
    },
    methods: {
      init() {

        // creates data for chart with '0' values fill when beginnning
        function mod(n, m) {
          return ((n % m) + m) % m;
        }
        const d = new Date();
        const hours = d.getHours();
        const minutes = d.getMinutes()

        let timeline = []
        for (let i = 0; i < 480; ++i) {
          // minutes
          let min = mod(minutes - i, 60);
          if (min < 10) min = `0${min}`;

          // hours
          let hoursBack = Math.floor((minutes - i) / 60);
          let hour = mod(hours + hoursBack, 24)
          if (hour == 0) hour = 12;
          if (hour < 10) hour = `0${hour}`;

          timeline.push(`00 ${hour}:${min}:00`);
        }
        this.xData = timeline.reverse();
        for (let arrayType in this.dataArrays) {
          for (let i = 0; i < 480; ++i) {
            this.dataArrays[arrayType].push(0);
          }
        }
        // defaults to 'hour' timeline
        this.setStartPoint('hour')
      },
      fillData () {
        this.datacollection = {
          labels: this.format(this.activexData),
          datasets: [{
            label: "Error",
            fill: 'origin',
            backgroundColor: 'rgb(244, 97, 112, .7)',
            borderColor: 'rgb(220, 53, 69, .7)',
            borderWidth: 2,
            lineTension: 0,
            data: this.activeArrays.error,
            hidden: false
          }, {
            label: "Warning",
            fill: 0,
            backgroundColor: 'rgb(255, 211, 81, .7)',
            borderColor: 'rgb(255, 193, 7, .7)',
            borderWidth: 2,
            lineTension: 0,
            data: this.activeArrays.warn,
            hidden: false
          }, {
            label: "Info",
            fill: 1,
            backgroundColor: 'rgb(93, 167, 247, .7)',
            borderColor: 'rgb(0, 123, 255, .7)',
            borderWidth: 2,
            lineTension: 0,
            data: this.activeArrays.info,
            hidden: false
          }]
        }
        this.chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              stacked: true,
              ticks: {
                suggestedMin: 0,
                suggestedMax: 10
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: false,
              }
            }]
          },
          tooltips: {
            mode: 'x',
            position: 'nearest',
            intersect: false,
            callbacks: {
              title: function() {
                return 'Logs received';
              }
            }
          },
          annotation: {
            // events: ['mouseover', 'mouseout'],
            // annotations: [
            //   {
            //     display: false,
            //     drawTime: "afterDatasetsDraw",
            //     id: "hline",
            //     type: "line",
            //     mode: "horizontal",
            //     scaleID: "y-axis-0",
            //     value: 100,
            //     borderColor: "rgb(239, 107, 67, .7)",
            //     borderWidth: 3,
            //     borderDash: [3, 3],
            //     label: {
            //       enabled: false,
            //       content: 'Log Threshold',
            //       backgroundColor: 'rgba(0, 0, 0, .8)'

            //     },
            //     onMouseover: function(e) {
            //       var element = this;
            //       element.options.label.enabled = true;
            //       element.chartInstance.update();
            //       return e;
            //     },
            //     onMouseout: function(e) {
            //       var element = this;
            //       element.options.borderWidth = 4;
            //       element.options.label.enabled = true;
            //       element.chartInstance.update();
            //       setTimeout(function() {
            //         element.options.label.enabled = false;
            //         element.chartInstance.update();
            //       }, 0);
            //       element.chartInstance.chart.canvas.style.cursor = 'initial';
            //       return e;
            //      }
            //   }
            // ]
          }
        }
      },
      addData (data, type) {
        const formattedTime = data.datetime.split(' ')[1].split(':').slice(0,2).join(':');
        const index = this.format(this.xData).findIndex( datetime => datetime == formattedTime );
        const activeIndex = this.format(this.activexData).findIndex( datetime => datetime == formattedTime );
        if (index >= 0) {
          if (this.dataArrays[type][index] !== undefined) {
            this.dataArrays[type][index] += data.weight;
            this.activeArrays[type][activeIndex] += data.weight;
          }
          else {
            this.dataArrays[type].push(data.weight);
            this.activeArrays[type].push(data.weight);
          }
        }
        else {
          this.xData.push(data.datetime);
          this.activexData.push(data.datetime);
          this.dataArrays[type].push(data.weight);
          this.activeArrays[type].push(data.weight);

          // adds initial values to other log types when starting a new date
          for (let arrayType in this.dataArrays) {
            if (arrayType != type) {
              if (this.dataArrays[arrayType][index] === undefined) {
                this.dataArrays[arrayType].push(0);
                this.activeArrays[arrayType].push(0);
              }
            }
            this.activeArrays[arrayType].shift();
            
          }
          this.activexData.shift();
        }

        // handles thresholds and email alerts
        this.checkThresholds(type, index);

        // handles maintaining the size of original data arrays
        const eightHours = 480;
        const fourHours = 240;
        if (this.xData.length > eightHours) {
          this.xData.splice(0, fourHours);
          for (let arrayType in this.dataArrays) {
            this.dataArrays[arrayType].splice(0, fourHours)
          }
        }

      },
      setStartPoint(option) {
        this.startPoint = option;
        const offset = this.startPoints[option];
        for (let type in this.activeArrays) {
          let original = this.dataArrays[type].slice();
          this.activeArrays[type] = this.dataArrays[type].slice(original.length - offset, original.length);
        }
        let originalxData = this.xData.slice();
        this.activexData = originalxData.slice(this.xData.length - offset, this.xData.length);
        
        this.fillData()

      },
      format(labels) {
        const formatted = labels.slice();
        for (const [index, label] of labels.entries()) {
          formatted[index] = label.split(' ')[1].split(':').slice(0,2).join(':');
        }
        return formatted;
      },
      checkThresholds(type, index) {
        const threshold = ServerStore.data.logThreshold[type];
        if (!ServerStore.data.muteEmail &&
            !(this.overThreshold[type]) && 
            this.dataArrays[type][index] > threshold) {
          // eslint-disable-next-line
          console.log(`${type} is over threshold. Sending email`);
          this.overThreshold[type] = true;
          ServerStore.methods.sendAlert(type);
        }
        else if (this.dataArrays[type][index] < threshold &&
                 index > 0 &&
                 this.dataArrays[type][index - 1] < threshold) {
          this.overThreshold[type] = false;
        }
      },
      runClock() {
        let now = new Date();
        let timeRemaining = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        setTimeout( () => {
          this.updateLiveTime();
          this.runClock();
        }, timeRemaining);
      },
      updateLiveTime() {
        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        if (minutes < 10) minutes = `0${minutes}`;
        if (hours < 10) hours = `0${hours}`;
        const liveTime = `00 ${hours}:${minutes}:00`;
        const formattedTime = `${hours}:${minutes}`
        const index = this.format(this.xData).findIndex( datetime => datetime == formattedTime );
        if (index < 0) {
          this.xData.push(liveTime);
          this.activexData.push(liveTime);
          for (let arrayType in this.dataArrays) {
            this.dataArrays[arrayType].push(0)
            this.activeArrays[arrayType].push(0)
            this.activeArrays[arrayType].shift();
          }
          this.activexData.shift();
          this.fillData();
        }
      }
    },
    computed: {
      formattedLabels () {
        return this.format(this.xData);
      }
    }
  }
</script>

<style>
</style>
