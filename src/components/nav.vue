<template>
  <f7-panel left cover :visible-breakpoint="960">
    <f7-view>
      <f7-page>
        <f7-navbar :title="entity"></f7-navbar>
        <!-- <f7-block-title>Left View Navigation</f7-block-title> -->

        <f7-list>
          <f7-list-item
            v-for="item in array_list"
            :key="item"
            :link="item.submenu ? '#' : false"
            :title="item.name"
            @click="validate_menu(item)"
          ></f7-list-item>
        </f7-list>
      </f7-page>
    </f7-view>
    <!-- {{ menu_user_x }} -->
  </f7-panel>
</template>

<script>
import { mapGetters } from "vuex";
// console.log(mapGetters);
export default {
  props: {
    entity: {
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
    this.validate_menu({ id: "" });
  },

  computed: {
    ...mapGetters({
      menu_user: "usuario/get_menu_user",
    }),
  },

  watch: {
    menu_user_x: function (val) {
      console.log(val);
    },
  },

  methods: {
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

    validate_menu(item = {}) {
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
  },
};
</script>