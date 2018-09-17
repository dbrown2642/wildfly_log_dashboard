<template>
  <b-modal id="thresholdModal" ok-only title="Change Log Threshold" ref="vuemodal">
    <div class="d-block text-center">
      <p class="mb-4">The log thresholds are currently set to:</p>
      
      <threshold-container logType="info" />
      <threshold-container logType="warn" />
      <threshold-container logType="error" />

    </div>
  </b-modal>
</template>

<script>
import ThresholdContainer from './ThresholdContainer'

export default {
  components: {
    'threshold-container' : ThresholdContainer
  }
}
</script>

<style>

</style>
