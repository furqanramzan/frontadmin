<template>
  <v-container grid-list-xl fluid>
    <confirm ref="confirm" />
    <loading ref="load" />
    <v-layout row wrap>
      <v-flex sm12>
        <v-toolbar color="transparent" flat dense card>
      <v-toolbar-title><h4 class="display-1">Table</h4></v-toolbar-title>
      <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="success" dark class="mb-2">New Item</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">New</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.usd" label="USD"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.price" label="Price"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
      
        
      </v-flex>        
      <v-flex lg12>
        <v-card>
          <v-toolbar card color="transparent" height="100">
            <v-layout row wrap>
              <v-flex xs12 sm8 class="pa-0">
                <v-btn color="red" @click="bulkDelete" :disabled="disabled" :loading="disabled" dark>Delete</v-btn>
                <v-btn color="warning" @click="refreash" :disabled="disabled" :loading="disabled">Refreash</v-btn>
                <v-btn color="red" @click="truncate" :disabled="disabled" :loading="disabled" dark>Truncate</v-btn>
              </v-flex>
              <v-flex xs12 sm4 class="pa-0">
                <v-form @submit.prevent="submitSearch">
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    @click:append="submitSearch"
                    label="Search"
                    hide-details
                    color="primary"
                  ></v-text-field> 
                </v-form>
              </v-flex> 
            </v-layout>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="items"
              :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
              class="elevation-1"
              select-all="primary"
              v-model="selected"
              :disable-initial-sort="true"
              :pagination.sync="pagination"
              :total-items="totalItems"
              >
              <template slot="items" slot-scope="props">
                <tr>
                  <td>
                    <v-layout wrap>
                      <v-flex xs6>
                        <v-checkbox
                          color="primary"
                          hide-details
                          v-model="props.selected"
                        ></v-checkbox>
                      </v-flex>
                      <v-flex xs6>
                        <v-icon class="mt-1"  @click="props.expanded = !props.expanded" v-html="props.expanded ? 'remove_circle_outline' : 'add_circle_outline'"></v-icon>
                      </v-flex>
                    </v-layout>
                    
                    
                  </td>             
                  <td class="px-2 py-0">{{ text_truncate(props.item.id,40) }}</td>
                  <td class="px-2 py-0">{{ text_truncate(props.item.name,40) }}</td>
                  <td class="px-2 py-0">{{ text_truncate(props.item.usd,40) }}</td>
                  <td class="px-2 py-0">{{ text_truncate(props.item.price,40) }}</td>
                  <td class="px-2 py-0">
                    <v-icon small class="mr-2" @click="editItem(props.item)" color="warning">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)" color="red">delete</v-icon>
                  </td>
                </tr>
              </template>

              <template slot="expand" slot-scope="props">
                <v-container class="pa-2">
                  <table border="1" style="width: 100%">
                    <tr>
                      <th class="subheading">Name</th>
                      <td>{{ props.item.name }}</td>
                    </tr>
                    <tr>
                      <th class="subheading">Name</th>
                      <td>{{ props.item.name }}</td>
                    </tr>
                    <tr>
                      <th class="subheading">Name</th>
                      <td>{{ props.item.name }}</td>
                    </tr>
                  </table>
                </v-container>
              </template>

              <template slot="pageText" slot-scope="props">
                Showing {{ props.pageStart }} to {{ props.pageStop }} of {{ props.itemsLength }} entries
              </template>
            </v-data-table>
            <div class="text-xs-right py-2" v-if="pages > 1">
              <v-pagination v-model="pagination.page" :length="pages" color="primary"></v-pagination>
            </div>
          </v-card-text>
        </v-card>
      </v-flex> 
      <v-fab-transition> 
        <v-btn v-scroll="onScroll" v-show="fab" small fab dark fixed bottom right color="primary" @click="$vuetify.goTo(0)">
          <v-icon>keyboard_arrow_up</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-layout>
  </v-container>
</template>

<script>
import Confirm from '@/components/Confirm'
import Loading from '@/components/Loading'
export default {
  components: { Confirm, Loading },
  data () {
    return {
      headers: [
        { text: 'ID' , value: 'id' , class: 'subheading px-2 py-0' },
        { text: 'Name' , value: 'name' , class: 'subheading px-2 py-0' },
        { text: 'Usd' , value: 'usd' , class: 'subheading px-2 py-0' },
        { text: 'Price' , value: 'price' , class: 'subheading px-2 py-0'},
        { text: 'Action' , value: '' , class: 'subheading px-2 py-0' , sortable: false},
      ],
      fab: false,
      selected: [],
      editedIndex: -1,
      dialog: false,
      editedItem: { name: '', usd: '', price: '' },
      disabled: false,
      search: '',
      pagination: {},
    }
  },
  methods: {
    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset ||   e.target.scrollTop || 0
      this.fab = top > 20
    },
     
    async truncate(){
      if (await this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' })) {
        console.log('ik')
      }
      else {
        console.log('cancle')
      }
      // this.$nuxt.$loading.start()
      // var self = this
      // await this.$axios.post('/currency/truncate')
      // .then(function(response){
      //   self.$nuxt.$loading.finish()
      //   self.items = []        
      // })
      // .catch(function(err){
      //   self.$nuxt.$loading.fail()        
      // })
    },

    text_truncate(str, length, ending) {
      if (length == null) {
        length = 100;
      }
      if (ending == null) {
        ending = '...';
      }
      if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
      } else {
        return str;
      }
    },

    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async save() {
      var self = this
      if (this.editedIndex > -1) {
        await this.$axios.put('/currency', this.editedItem)
        .then(function(response){
          Object.assign(self.items[self.editedIndex], response.data)
        })
      } else {
        console.log(this.editedItem)
        await this.$axios.post('/currency', this.editedItem)
        .then(function(response){
          self.items.unshift(response.data)
          self.$nuxt.$loading.finish()
        })
        .catch(function(){
          self.$nuxt.$loading.fail()
        })
      }
      this.close()
    },

    submitSearch(){
      this.$nuxt.$loading.start()
      this.getSignal()
    },

    async deleteItem(item) {
      this.$nuxt.$loading.start()
      var self = this
      const index = this.items.indexOf(item)
      var confirm = window.confirm('Are you sure you want to delete this item?')
      if(confirm){
        await this.$axios.delete('/currency/' + item.id)
        .then(function(response){
          console.log('success')
          self.items.splice(index, 1)
          self.$nuxt.$loading.finish()
        })
        .catch(function(err){
          console.log('error')
          console.log(err.response)
          self.$nuxt.$loading.fail()
        })
      }
      else
        console.log(confirm) 
    },
    
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    refreash(){
      this.search = ''
      this.selected = []
      this.pagination = {
        descending: false,
        page: 1,
        rowsPerPage: 50,
        sortBy: null,
      }
    },

    async bulkDelete(){
      if (await this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' })) {
        this.$refs.load.loading()
        this.disabled = true
        var ids = [], self = this
        for(var selected in this.selected){
          ids.push(this.selected[selected].id)
        }
        await this.$axios.post('/currency/bulkDelete', {ids})
        .then(function(response){
          self.getSignal()
        })
        .catch(function(err){
          // self.$nuxt.$loading.fail() 
                
        })
        .then(function(){
          self.disabled = false
        })
      }
      else {
        console.log('cancle')
      }
    },

    async getSignal(){
      var table = this.pagination, self = this, url
      url = `/currency/${table.page}/${table.rowsPerPage}/${(table.sortBy ? table.sortBy+(table.descending ? '/desc' : '/asc') : '')}${(this.search ? '?search=' + this.search : '')}` 
      
      await this.$axios.get(url)
      .then(function(response){
        self.items = response.data.data
        self.totalItems = response.data.total
        self.pages = response.data.lastPage
        self.$nuxt.$loading.finish()
        self.$refs.load.loading() 
      })
      .catch(function(err){
        self.$nuxt.$loading.fail()
      })
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  mounted(){
    this.$watch('pagination', function(){
      this.$nuxt.$loading.start()
      this.$refs.load.loading()
      return this.getSignal()
    }, {
      deep: true
    })
  },
  asyncData({ app }){
    return app.$axios.get('/currency/1/50')
    .then((response) => {
      return { 
        items: response.data.data, 
        totalItems: response.data.total,
        pages: response.data.lastPage,
        pagination: {
          page: 1,
          rowsPerPage: 50
        }
      }
    })
  }
};
</script>

<style>
@media (max-width: 600px) {
  .dynamic-height{
    height: 100px;
  }
}
</style>
