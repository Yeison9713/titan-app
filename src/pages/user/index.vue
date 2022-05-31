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

      <f7-nav-title-large>titan-app</f7-nav-title-large>

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
    return {};
  },

  computed: {
    ...mapGetters({
      info: "user/get_info",
    }),
  },

  methods: {
    ...mapActions({ logout: "user/logout" }),
  },
};
</script>