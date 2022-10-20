<template>
  <f7-panel left cover :visible-breakpoint="960">
    <div class="header_nav">
      <div class="content_nav">
        <div class="siglas">
          <div class="content_siglas">
            {{ acronym(user) }}
          </div>
        </div>

        <div class="data_user">
          <span>{{ user }}</span>
        </div>
      </div>
    </div>

    <f7-block class="no-padding">
      <f7-treeview v-for="item in menu_user" :key="item">
        <f7-block-title>{{ item.name }}</f7-block-title>

        <f7-treeview-item
          v-for="submenu in item.submenu"
          :key="submenu"
          :label="submenu.name"
          :item-toggle="submenu.link ? false : true"
          view=".safe-areas"
          :panel-close="submenu.link ? true : false"
          :toggle="submenu.link ? false : true"
          :link="validate_link(submenu)"
        >
          <f7-treeview-item
            v-for="submenu2 in submenu.submenu"
            :key="submenu2"
            :label="submenu2.name"
            view=".safe-areas"
            :panel-close="submenu2.link ? true : false"
            :link="validate_link(submenu2)"
          >
          </f7-treeview-item>
        </f7-treeview-item>
      </f7-treeview>
    </f7-block>
  </f7-panel>
</template>

<script>
import { mapGetters } from "vuex";
import { format_num } from "../js/utils/plugins";

export default {
  props: {
    user: {
      type: String,
      default: null,
    },
    id_company: {
      type: String,
      default: null,
    },
  },

  data() {
    return {};
  },

  async mounted() {},

  computed: {
    ...mapGetters({
      config_user: "user/get_data_config",
      menu_user: "setting/get_menu_user",
      setting: "setting/get_data",
    }),
  },

  methods: {
    format_num,
    acronym(data = "") {
      return data.match(/\b([A-Z])/g).join("");
    },
    validate_link(item) {
      if (
        (!this.setting.id_empr || !this.config_user?.id) &&
        item?.link != "/usuario/synapp/"
      ) {
        return "#";
      }

      if (item.submenu) return "#";
      if (item.link) return item.link;

      return false;
    },
  },
};
</script>

<style lang="sass">
.header_nav,
.content_nav,
.siglas,
.content_siglas
  display: flex
  font-size: 16px
  font-weight: 600

.header_nav
  width: 100%
  height: 80px
  align-items: center
  background: #0c57b2
  color: #fff

.content_nav
  width: 100%

  .siglas
    width: 20%
    justify-content: center
    text-align: center

  .data_user
    display: flex
    align-items: center
    width: 80%
    font-size: 14px

.content_siglas
  justify-content: center
  text-align: center
  align-items: center
  width: 40px
  height: 40px
  background-color: #f5d4df
  color: #0c57b2
  border-radius: 100%
</style>