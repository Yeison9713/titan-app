<template>
  <f7-panel left cover :visible-breakpoint="960">
    <f7-view>
      <f7-page>
        <f7-navbar
          :title="company"
          :subtitle="format_num(id_company)"
        ></f7-navbar>
        <f7-block-title>Navegación</f7-block-title>

        <f7-list>
          <f7-list-item
            v-for="item in array_list"
            view=".safe-areas"
            :key="item"
            :title="item.name"
            :panel-close="item.link ? true : false"
            :link="validate_link(item)"
            @click="validate_menu(item)"
          ></f7-list-item>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-panel>
</template>

<script>
import { mapGetters } from "vuex";
import { format_num } from "../js/utils/plugins";

export default {
  props: {
    company: {
      type: String,
      default: null,
    },
    id_company: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      array_list: [],
      menu_list: [],
    };
  },

  async mounted() {
    this.menu_list = await this.order_list(this.menu_user);
    this.set_option_id();
  },

  computed: {
    ...mapGetters({
      menu_user: "user/get_menu",
    }),
  },

  methods: {
    format_num,
    validate_link(item) {
      if (item.submenu) return "#";
      if (item.link) return item.link;

      return false;
    },

    validate_menu(item = {}) {
      if (item.submenu || item.name == "Atras") this.set_option_id(item);
    },

    set_option_id(item = { id: "" }) {
      let data = [];

      if (item.name == "Atras") item.id = String(item.id).slice(0, -1) || "";

      for (const item2 of this.menu_list) {
        let id = String(item2.id).slice(0, -1);
        data = id == item.id ? data.concat(item2) : data;
      }

      if (item.id) data = this.set_back_list(data, item.id);

      this.array_list = data;
    },

    set_back_list(list, id) {
      return list.concat({ name: "Atras", id });
    },

    async order_list(data) {
      let new_data = [];

      for await (let item of data) {
        new_data.push({ ...item });

        if (item.submenu) {
          let other = await this.order_list(item.submenu);
          new_data = new_data.concat(other);
        }
      }

      return new_data;
    },
  },
};
</script>