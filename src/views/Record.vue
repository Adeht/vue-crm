<template>
  <div>
    <div class="page-title">
      <h3>{{'New_record' | localize}}</h3>
    </div>

    <Loader v-if="loading"/>
    <p class="center" v-else-if="!categories.length">{{'No_category' | localize}}. <router-link to="/categories">Добавить категорию.</router-link></p>
    <form v-else class="form" @submit.prevent="submitHandler">
      <div class="input-field" >
        <select
          ref="select" v-model="category">
          <option v-for="c of categories" :key="c.id" :value="c.id">{{c.title}}</option>
        </select>
        <label>{{'Change_category' | localize}}</label>
      </div>

      <p>
        <label>
          <input
              class="with-gap"
              name="type"
              type="radio"
              value="income"
              v-model="type"
          />
          <span>{{'income' | localize}}</span>
        </label>
      </p>

      <p>
        <label>
          <input
              class="with-gap"
              name="type"
              type="radio"
              value="outcome"
              v-model="type"
          />
          <span>{{'outcome' | localize}}</span>
        </label>
      </p>

      <div class="input-field">
        <input
            v-model.number="amount"
            id="amount"
            type="number"
            :class="{invalid: $v.amount.$dirty && !$v.amount.minValue}"
        >
        <label for="amount">{{'Sum' | localize}}</label>
        <span v-if="$v.amount.$dirty && !$v.amount.minValue" class="helper-text invalid">{{'Min_summa' | localize}} {{$v.amount.$params.minValue.min}} грн.</span>
      </div>

      <div class="input-field">
        <input
            v-model="description"
            id="description"
            type="text"
            :class="{invalid: $v.description.$dirty && !$v.description.required}"
        >
        <label for="description">{{'Description' | localize}}</label>
        <span v-if="$v.description.$dirty && !$v.description.required"
            class="helper-text invalid">{{'Not_blank' | localize}}</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{'Create' | localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import {required, minValue} from 'vuelidate/src/validators'
import {mapGetters} from 'vuex'
import localizeFilter from "@/filters/localize.filter";
export default {
  name: 'record',
  data: () => ({
    loading: true,
    categories: [],
    select: null,
    category: null,
    type: 'outcome',
    amount: 1,
    description: ''
  }),
  validations: {
    amount: {minValue: minValue(1)},
    description: {required}
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false

    setTimeout(() => {
      M.updateTextFields();
      this.select = M.FormSelect.init(this.$refs.select)
    }, 0)

    if (this.categories.length) {
      this.category = this.categories[0].id
    }
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true
      }

      return this.info.bill >= this.amount
    }
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch('createRecord', {
            categoryID: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          })

          const bill = this.type === 'income' ? this.info.bill + this.amount : this.info.bill - this.amount

          await this.$store.dispatch('updateInfo', {bill})
          this.$message(localizeFilter('Create_record_success'))
          this.$v.$reset()

          this.amount = 1
          this.description = ''
        } catch (e) {}
      } else {
        this.$message(`${localizeFilter('Low_money')} (${this.amount - this.info.bill})`)
      }
    }
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>