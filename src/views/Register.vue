<template>
  <form class="card auth-card" @submit.prevent="submitHandle">
    <div class="card-content">
      <span class="card-title">{{'Home_buh' | localize}}</span>
      <div class="input-field">
        <input
            id="email"
            type="text"
            v-model.trim="email"
            :class="{invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"

        >
        <label for="email">Email</label>
        <small
            v-if="$v.email.$dirty && !$v.email.required"
            class="helper-text invalid">{{'Not_blank' | localize}}</small>
        <small
            v-else-if="$v.email.$dirty && !$v.email.email"
            class="helper-text invalid">{{'Not_email' | localize}}</small>
      </div>
      <div class="input-field">
        <input
            id="password"
            type="password"
            v-model.trim="password"
            :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
        >
        <label for="password">{{'Password' | localize}}</label>
        <small v-if="($v.password.$dirty && !$v.password.required)" class="helper-text invalid">{{'Input_password' | localize}}</small>
        <small v-else-if="($v.password.$dirty && !$v.password.minLength)" class="helper-text invalid">{{'Min_pass' | localize}} {{$v.password.$params.minLength.min}} символов. Вы ввели {{password.length}}.</small>
      </div>
      <div class="input-field">
        <input
            id="name"
            type="text"
            v-model.trim="name"
            :class="{invalid: $v.name.$dirty && !$v.name.required }"
        >
        <label for="name">{{'Name' | localize}}</label>
        <small v-if="$v.name.$dirty && !$v.name.required" class="helper-text invalid">{{'Not_blank' | localize}}</small>
      </div>
      <p>
        <label>
          <input type="checkbox" v-model="agree"/>
          <span>{{'Rules_check' | localize}}</span>
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button
            class="btn waves-effect waves-light auth-submit"
            type="submit"
        >
          {{'Register' | localize}}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{'Acc_is_set' | localize}}?
        <router-link to="/login">{{'Enter' | localize}}!</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import {email, minLength, required} from "vuelidate/src/validators";

export default {
    name: 'Register',
  data: () => ({
    email: '',
    password: '',
    name: '',
    agree: false
  }),
  validations: {
    email: {email, required},
    password: {required, minLength: minLength(6)},
    name: {required},
    agree: {check: v=>v}
  },
  methods: {
      async submitHandle() {
        if ( this.$v.$invalid ) {
          this.$v.$touch()
          return
        }

        const formData = {
          email: this.email,
          password: this.password,
          name: this.name
        }

        try {
          await this.$store.dispatch('register', formData)
          this.$router.push('/')
        } catch (e) {

        }
      }
  }
}
</script>