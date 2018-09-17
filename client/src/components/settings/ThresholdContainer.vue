<template>
  <div class="row justify-content-md-center mt-4">
    <div class="col-4 rounded pt-2 pb-2" :class="backgroundColor">
      <p class="my-auto p-2 text-light lead"> {{ logsPerMinute }} {{ logType }} / min</p>
    </div>
    <div class="col-md-auto my-auto">
      <b-form @submit="onSubmit" class="form-inline">
        <b-form-input v-model="updateValue" 
                      type="number"
                      required>
        </b-form-input>
        <b-button :variant="buttonVariant" 
                  class="ml-2"
                  type="submit">
          Update
        </b-button>
      </b-form>
    </div>

  </div>
</template>

<script>
import ServerStore from '../../stores/ServerStore.js';

export default {
  props: ['logType'],
  data () {
    return {
      logsPerMinute: null,
      updateValue: null,
      scheme: ''
    }
  },
  computed: {
    backgroundColor: function () {
      return `bg-${this.scheme}`;
    },
    buttonVariant: function () {
      return `outline-${this.scheme}`;
    }
  },
  created () {
    switch(this.logType) {
      case 'info':
        ServerStore.methods.getInfo()
        .then( response => {
          this.updateThreshold('info', response);
          this.scheme = 'primary';
        })
        break;
      case 'warn':
        ServerStore.methods.getWarn()
        .then( response => {
          this.updateThreshold('warn', response);
          this.scheme = 'warning';
        })
        break;
      case 'error':
        ServerStore.methods.getError()
        .then( response => {
          this.updateThreshold('error', response);
          this.scheme = 'danger';
        })
        break;
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault();

      switch(this.logType) {
        case 'info':
          ServerStore.methods.setInfo(this.updateValue)
          .then( response => {
            this.updateThreshold('info', response);
          })
          break;
        case 'warn':
          ServerStore.methods.setWarn(this.updateValue)
          .then( response => {
            this.updateThreshold('warn', response);
          })
          break;
        case 'error':
          ServerStore.methods.setError(this.updateValue)
          .then( response => {
            this.updateThreshold('error', response);
          })
          break;
      }
      this.updateValue = null;
    },
    updateThreshold (type, response) {
      ServerStore.data.logThreshold[type] = response.data[type];
      this.logsPerMinute = ServerStore.data.logThreshold[type];
    }
  }
}
</script>

<style>

</style>
