<template>
  <b-modal id="alertModal" ok-only title="Configure Email Alerts" ref="vuemodal">
    <div class="container ">
      <div class="row mb-4">
          <p class="text-dark lead align-bottom mb-0 mt-1">
            Emails are currently {{emailMuted ? 'muted' : 'live'}}
          </p>
          <b-button variant="outline-secondary" 
                    @click="muteEmails({muted: true})" 
                    v-show="!emailMuted"
                    class="ml-2">
            Mute
          </b-button>
          <b-button variant="outline-secondary" 
                    @click="muteEmails({muted: false})" 
                    v-show="emailMuted"
                    class="ml-2">
            Unmute
          </b-button>
      </div>
    </div>
    <div class="d-block">
      <p>The application will update the following people when logs go over the threshold:</p>
    </div>
    <b-list-group>
      <b-list-group-item v-for="person in alertedPeople" :key="person.id">
        <b-row>
          <div class="text-center my-3">
          </div>
          <b-col cols="11 my-auto">
            <p class="my-auto">
              {{ person.name }}
            </p>
            <p class="text-muted my-auto">
              <small>{{ person.email }}</small>
            </p>
          </b-col>
          <b-col cols="1 pl-0 my-auto">
            <b-button variant="danger" 
                      size="sm" class="pull-right" 
                      @click="removePerson(person)">
              <font-awesome-icon icon="times" />
            </b-button>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
    <div class="pt-3">
      <b-button variant="outline-success" 
                @click="onNewForm" 
                v-show="!formActive">
        Add Person
      </b-button>
      <alert-form v-show="formActive" 
                  @submitted="onSubmit" 
                  @formClosed="onClose" 
                  :resetForm="formActive" />
    </div>
  </b-modal>
</template>

<script>
import AlertForm from './AlertForm.vue'
import ServerStore from '../../stores/ServerStore.js'

export default {
  name: 'AlertModal',
  components: {
    'alert-form' : AlertForm
  },
  data() {
    return {
      alertedPeople: [],
      formActive: false,
      emailMuted: ServerStore.data.muteEmail
    }
  },
  methods: {
    onSubmit (value) {
      ServerStore.methods.addAlerted(value)
      .then(response => {
        ServerStore.data.alertedPeople = response.data;
        this.alertedPeople = ServerStore.data.alertedPeople;
        this.formActive = false;
      });
    },
    removePerson (person) {
      ServerStore.methods.removeAlerted(person)
      .then(response => {
        ServerStore.data.alertedPeople = response.data;
        this.alertedPeople = ServerStore.data.alertedPeople;
      });
    },
    onNewForm () {
      this.formActive = true;
    },
    onClose () {
      this.formActive = false;
    },
    muteEmails (value) {
      ServerStore.methods.setMuted(value)
      .then(response => {
        ServerStore.data.muteEmail = response.data;
        this.emailMuted = ServerStore.data.muteEmail;
      });
    },
  },
  created() {
    ServerStore.methods.getAlerted()
    .then(response => {
      ServerStore.data.alertedPeople = response.data;
      this.alertedPeople = ServerStore.data.alertedPeople;
    });
    ServerStore.methods.getMuted()
    .then(response => {
      ServerStore.data.muteEmail = response.data;
      this.emailMuted = ServerStore.data.muteEmail;
    })
  }
}
</script>

<style>
</style>