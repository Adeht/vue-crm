<template>
  <div>
    <div class="page-title">
      <h3>{{'Profile' | localize}}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input
            id="description"
            type="text"
            v-model="name"
            :class="{invalid: $v.name.$dirty && !$v.name.required}"
        >
        <label for="description">{{'Name' | localize}}</label>
        <span
            v-if="$v.name.$dirty && !$v.name.required"
            class="helper-text invalid">{{'Not_blank' | localize}}</span>
      </div>

      <div class="switch">
        <label>
          Українська
          <input type="checkbox" v-model="isRU">
          <span class="lever"></span>
          Русский
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{'Refresh' | localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {required} from "vuelidate/lib/validators";
export default {
  data: () => ({
    name: '',
    isRU: true
  }),
  mounted() {
    this.name = this.info.name
    this.isRU = this.info.locale === 'ru-RU'
    setTimeout(M.updateTextFields) //Для правильного позиционирования метериализа
  },
  validations: {
    name: {required},
  },
  computed: {
    ...mapGetters(['info'])
  },
  methods: {
    ...mapActions(['updateInfo']),
    async submitHandler() {
      if ( this.$v.$invalid ) {
        this.$v.$touch()
        return
      }

      try {
        await this.updateInfo({
          name: this.name,
          locale: this.isRU ? 'ru-RU' : 'uk-UA'
        })
      } catch (e) {}
    }
  },
}
</script>

<style scoped>
.switch {
  margin-bottom: 2rem;
}
</style>