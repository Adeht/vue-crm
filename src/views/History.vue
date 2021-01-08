<template>
  <div>
    <div class="page-title">
      <h3>{{'History' | localize}}</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <Loader v-if="loading"/>
    <p class="center" v-else-if="!records.length">{{'Records_not_found' | localize}}. <router-link to="/record">Добавить первую запись</router-link></p>
    <section v-else>
      <HistoryTable :records="items"/>
      <Paginate
          v-model="page"
          :page-count="pageCount"
          :click-handler="pageChangeHandler"
          :prev-text="'Назад'"
          :next-text="'Вперед'"
          :container-class="'pagination'"
          :page-class="'waves-effect'"
      />
    </section>
  </div>
</template>

<script>
import paginationMixins from "@/mixins/pagination.mixin"
import HistoryTable from "@/components/HistoryTable"
import {Pie} from "vue-chartjs"
import localizeFilter from "@/filters/localize.filter";

export default {
  name: 'history',
  extends: Pie,
  mixins: [paginationMixins],
  data: () => ({
    loading: true,
    records: [],
  }),
  async mounted(){
    this.records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')
    this.setup(categories)
    this.loading = false
  },
  methods: {
    setup(categories) {
      this.setupPagination( this.records.map(record => ({
        ...record,
        categoryName: categories.find(cat => cat.id === record.categoryID).title,
        typeText: localizeFilter(record.type),
        typeColor: record.type === 'income' ? 'green' : 'red'
      })) )

      this.renderChart({
        labels: categories.map(c => c.title),
        datasets: [{
          label: localizeFilter('Minus_by_category'),
          data: categories.map(c => {
            return this.records.reduce((total, r) => {
              if (r.categoryID === c.id && r.type === 'outcome') {
                total += +r.amount
              }
              return total
            }, 0)
          }),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      })
    }
  },
  components: {
    HistoryTable
  }
}
</script>