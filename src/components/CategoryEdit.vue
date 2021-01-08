<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'Edit' | localize}}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field" >
          <select ref="select" v-model="current">
            <option v-for="c of categories" :key="c.id" :value="c.id"> {{c.title}} </option>
          </select>
          <label>{{'Change_category' | localize}}</label>
        </div>

        <div class="input-field">
          <input
              id="name"
              type="text"
              v-model="title"
              :class="{invalid: $v.title.$dirty && !$v.title.required}"
          >
          <label for="name">{{'title' | localize}}</label>
          <span v-if="$v.title.$dirty && !$v.title.required" class="helper-text invalid">{{'Input_title_category' | localize}}</span>
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
          {{'Refresh' | localize}}
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
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    select : null,
    title: '',
    limit: 1,
    current: null
  }),
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
        const catData = {
          id: this.current,
          title: this.title,
          limit: this.limit
        }

        await this.$store.dispatch('updateCategory', catData)
        this.$message(localizeFilter('Category_update'))
        this.$emit('updated', catData)
      } catch (e) {

      }
    }
  },
  mounted() {
    M.updateTextFields();
    this.select = M.FormSelect.init(this.$refs.select)
  },
  watch: {
    current(catID) {
      let {title, limit} = this.categories.find(c => c.id === catID)
      this.title = title
      this.limit = limit
    }
  },
  created() {
    let {id, title, limit} = this.categories[0]
    this.current = id
    this.title = title
    this.limit = limit
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>