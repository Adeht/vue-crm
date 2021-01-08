<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'Create' | localize}}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <input
              id="name"
              type="text"
              v-model="title"
              :class="{invalid: $v.title.$dirty && !$v.title.required}"
          >
          <label for="name">{{ 'title' | localize }}</label>
          <span v-if="$v.title.$dirty && !$v.title.required" class="helper-text invalid">{{'Input_title_category'|localize}}</span>
        </div>

        <div class="input-field">
          <input
              id="limit"
              type="number"
              v-model.number="limit"
              :class="{invalid: $v.limit.$dirty && !$v.limit.minValue}"
          >
          <label for="limit">{{'Limit' | localize}}</label>
          <span v-if="$v.limit.$dirty && !$v.limit.minValue" class="helper-text invalid">{{'Min_summa' | localize}} {{$v.limit.$params.minValue.min}} грн.</span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{'Create' | localize}}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>
<script>
import {required, minValue} from 'vuelidate/src/validators'
import localizeFilter from "@/filters/localize.filter";
export default {
  data: () => ({
    title: '',
    limit: 1
  }),
  mounted() {
    M.updateTextFields();
  },
  validations: {
    title: {required},
    limit: {minValue: minValue(1)}
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        const category = await this.$store.dispatch('createCategory', {
          title: this.title,
          limit: this.limit
        })
        this.title = ''
        this.limit = 1
        this.$v.$reset()
        this.$message(localizeFilter('Category_create'))
        this.$emit('created', category)
      } catch (e) {

      }
    }
  }
}
</script>