<template>
  <f7-popup
    class="lookup"
    v-model:opened="estado"
    @popup:opened="open"
    @popup:closed="closed"
  >
    <f7-view>
      <f7-page>
        <f7-navbar :title="`Busqueda de ${titulo_navbar(params.text)}`">
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>

          <f7-subnavbar :inner="false">
            <f7-searchbar
              search-container=".lookup .virtual-list"
              search-item=".lookup li"
              search-in=".lookup .item-title"
              placeholder="Buscar por código o nombre..."
            ></f7-searchbar>
          </f7-subnavbar>
        </f7-navbar>

        <f7-list class="searchbar-not-found">
          <f7-list-item
            title="No se han encontrado coincidencias"
          ></f7-list-item>
        </f7-list>

        <f7-list
          :id="listId"
          class="search-list searchbar-found"
          virtual-list
          :virtual-list-params="{
            items: lookup,
            searchAll: filter_data,
            renderExternal,
          }"
        >
          <ul style="height: auto !important">
            <f7-list-item
              media-item
              v-for="(item, j) in vlData.items"
              :key="j"
              link="#"
              :title="item.text"
              after="Seleccionar"
              custom-search
              :style="`top: ${vlData.topPosition}px`"
              @click="select_item(item)"
            >
              <template #text>
                <b>Código:</b>
                {{ parseInt(item.value) }}
              </template>
            </f7-list-item>
          </ul>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>

<script>
import { f7 } from "framework7-vue";

export default {
  props: {
    estado: Boolean,
    params: Object,
  },
  data() {
    return {
      lookup: [],
      vlData: {
        items: [],
      },
    };
  },
  computed: {
    listId() {
      return "lookup-list-" + this.params?.text;
    },
  },
  methods: {
    titulo_navbar(text = "") {
      return text.toLocaleLowerCase() || "";
    },
    select_item(item) {
      let getter = this.$store.getters;
      let { vuex } = this.params;
      let data = getter[vuex.getter] || [];
      let itemReturn = data[item.index] || {}
      this.$emit("callback", itemReturn);
    },

    async open() {
      let getter = this.$store.getters;
      let { vuex, columns, text } = this.params;

      let data = (await getter[vuex.getter]) || [];

      await Promise.all(
        data.map(async (item, index) => {
          let texto = item[columns.text] || "";
          if (text == "Productos") texto = atob(texto);

          let value = "";
          for (const e of columns.value) {
            value += String(item[e]);
          }

          this.lookup.push({ text: texto, value, index });
          return item;
        })
      );

      this.replaceData(this.lookup);
    },

    closed() {
      this.lookup = [];

      this.replaceData([]);
      this.$emit("closed", false);
    },

    filter_data(query, items) {
      const found = [];
      let keys = ["text", "value"];

      let data = items
        .map((el, index) => {
          el.index = index;
          return el;
        })
        .filter((el) =>
          keys.some((key) =>
            el[key].toString().toUpperCase().includes(query.toUpperCase())
          )
        );

      data.forEach((el) => found.push(el.index));
      return found;
    },

    replaceData(data = []) {
      let virtualList = f7.virtualList.get(
        document.getElementById(this.listId)
      );

      if (virtualList) {
        virtualList.replaceAllItems(data);
      }
    },

    renderExternal(vl, vlData) {
      this.vlData = vlData;
    },
  },
};
</script>

<style lang="sass">
#lookup-list ul
  height: auto !important
</style>
