/**
 * @file manages the rendering of ChartJS Line Chart
 * @author: dbrown
 */

import { Line, mixins } from 'vue-chartjs'
import chartAnnotations from 'chartjs-plugin-annotation'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp, chartAnnotations],
  props: ['options'],
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}