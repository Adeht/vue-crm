<template>
  <div>
    <div class="page-title">
      <h3>{{'Categories' | localize}}</h3>
    </div>
    <section>
      <Loader v-if="loading" />
      <div v-else class="row">
        <CategoryCreate @created="addNewCategories"/>
        <CategoryEdit
            v-if="categories.length"
            :categories="categories"
            :key="categories.length + updateCount"
            @updated="updateCategories"/>
        <p v-else class="center">{{'Category_not_found' | localize}}</p>
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from '@/components/CategoryCreate'
import CategoryEdit from '@/components/CategoryEdit'
export default {
  name: 'categories',
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0
  }),
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false

  },
  components: {CategoryEdit, CategoryCreate},
  methods: {
    addNewCategories(category) {
      this.categories.push(category)
    },
    updateCategories(category) {
      const inx = this.categories.findIndex(c => c.id === category.id)
      this.categories[inx].title = category.title
      this.categories[inx].limit = category.limit
      this.updateCount++
    }
  }
}
</script>