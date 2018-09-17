<template>
  <div class="rounded p-3 border border-secondary-50">
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group label="Add Person">
        <b-form-input placeholder="Name"
                      v-model="alertForm.name" lazy
                      required>
        </b-form-input>
      </b-form-group>
      <b-form-group label="Add Email">
        <b-form-input placeholder="email@website.com"
                      v-model="alertForm.email" lazy
                      required>
        </b-form-input>
      </b-form-group>
      <b-button type="submit" variant="outline-success" class="mr-2">Submit</b-button>
      <b-button type="reset" variant="outline-danger">Cancel</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  props: ['resetForm'],
  data () {
    return {
      alertForm: {
        name: '',
        email: ''
      }
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault();
      this.$emit('submitted', this.alertForm);
    },
    onReset (evt) {
      evt.preventDefault();
      this.$emit('formClosed');
    },
  },
  watch: {
    resetForm() {
      this.alertForm.email = '';
      this.alertForm.name = '';
    }
  }
}
</script>

<style>

</style>
