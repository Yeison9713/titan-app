<template>
  <f7-page name="user">
    <f7-navbar large>
      <f7-nav-left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="f7:menu"
          icon-md="material:menu"
          panel-open="left"
        ></f7-link>
      </f7-nav-left>

      <f7-nav-title-large>{{
        setting?.descrip_empr || "Falta configurar"
      }}</f7-nav-title-large>

      <f7-nav-right>
        <f7-link
          :style="{ color: '#FFF' }"
          icon-material="more_vert"
          popover-open="#user-action"
        ></f7-link>
        <f7-popover id="user-action" :backdrop="false">
          <f7-list>
            <f7-list-item popover-close>
              <b>{{ info.user.name }}</b>
              <!-- <f7-badge color="blue">OPERADOR</f7-badge> -->
            </f7-list-item>

            <f7-list-item
              link="#"
              popover-close
              title="Salir"
              @click="logout"
            ></f7-list-item>
          </f7-list>
        </f7-popover>
      </f7-nav-right>
    </f7-navbar>
    <Nav :user="info.user.name" :id_company="info.company.id"></Nav>

    <f7-list>
      <f7-list
        class="width-100"
        inset
        no-hairlines
        no-hairlines-between
        :style="{ margin: '11px 0 5px 0' }"
      >
        <f7-list-item id="logo">
          <div
            :style="{
              backgroundImage: `url(${logo})`,
              backgroundSize: '90%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }"
          ></div>
        </f7-list-item>
      </f7-list>
    </f7-list>
  </f7-page>
</template>


<script>
import Nav from "../../components/nav.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Nav,
  },
  data() {
    return { logo: null };
  },

  async created() {
    let dispatch = this.$store.dispatch;
    await dispatch("setting/query_data");
  },

  computed: {
    ...mapGetters({
      info: "user/get_info",
      setting: "setting/get_data",
    }),
  },

  watch: {
    setting: function (val) {
      let nit = parseFloat(val?.id_empr) || 0;
      console.log(nit);
      this.logo = `https://www.titansoluciones.net/img/${nit}.png`;
    },
  },

  methods: {
    ...mapActions({ logout: "user/logout" }),
  },
};
</script>

<style lang="sass">
[data-name=user]

  .title-large-text
    font-size: 20px !important

  .page-content
    background: #fff !important

  .list
    height: 80%
    display: flex
    justify-content: center
    align-items: center

#logo
  display: flex
  justify-content: space-around
  align-items: center

  .item-inner
    flex-direction: column
    padding: 0

  div
    width: 200px
    height: 200px

  .item-content
    padding: 0
</style>