<template>
  <div>
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>

    <Loader v-if="loading"/>
    <p class="center" v-else-if="!categories.length">Категории не заданы. <router-link to="/categories">Добавить категорию.</router-link></p>
    <form v-else class="form" @submit.prevent="submitHandler">
      <div class="input-field" >
        <select
          ref="select" v-model="category">
          <option v-for="c of categories" :key="c.id" :value="c.id">{{c.title}}</option>
        </select>
        <label>Выберите категорию</label>
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
          <span>Доход</span>
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
          <span>Расход</span>
        </label>
      </p>

      <div class="input-field">
        <input
            v-model.number="amount"
            id="amount"
            type="number"
            :class="{invalid: $v.amount.$dirty && !$v.amount.minValue}"
        >
        <label for="amount">Сумма</label>
        <span v-if="$v.amount.$dirty && !$v.amount.minValue" class="helper-text invalid">Минимальная сумма {{$v.amount.$params.minValue.min}} грн.</span>
      </div>

      <div class="input-field">
        <input
            v-model="description"
            id="description"
            type="text"
            :class="{invalid: $v.description.$dirty && !$v.description.required}"
        >
        <label for="description">Описание</label>
        <span v-if="$v.description.$dirty && !$v.description.required"
            class="helper-text invalid">Описание обязательно</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Создать
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import {required, minValue} from 'vuelidate/src/validators'
import {mapGetters} from 'vuex'
export default {
  name: 'record',
  components: {Loader},
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
          this.$message('Запись успешно создана')
          this.$v.$reset()

          this.amount = 1
          this.description = ''
        } catch (e) {}
      } else {
        this.$message(`На счету недостаточно средств (${this.amount - this.info.bill})`)
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