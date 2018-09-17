<template>
  <div id="app">
    <nav class="navbar sticky-top navbar-light bg-light navbar-expand-lg">
      <img src="./assets/dashboard_logo.png" height="52" class="d-inline-block align-top mr-2">
      <b-navbar-brand>Log Dashboard</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown text="Settings" right>
          <b-dropdown-item href="#" v-b-modal.alertModal>Configure Email Alerts</b-dropdown-item>
          <b-dropdown-item href="#" v-b-modal.thresholdModal>Change Log Threshold</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </nav>
    <AlertModal />
    <ThresholdModal />
    <div class="container-fluid pl-5 pr-5 pt-4">
      <div class="row justify-content-center">
        <div class="col-10"><LiveChart /></div>
      </div>
      <div class="row justify-content-center">
        <LogFeed class="col-10" />
      </div>
      
    </div>
  </div>
</template>

<script>
import LiveChart from './components/LiveChart.vue'
import LogFeed from './components/LogFeed.vue'
import AlertModal from './components/settings/AlertModal.vue'
import ThresholdModal from './components/settings/ThresholdModal.vue'

export default {
  name: 'app',
  components: {
    LiveChart,
    LogFeed,
    AlertModal,
    ThresholdModal
  }
}
</script>

<style>
</style>