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
    </f7-navbar>
    <Nav :entity="info_user.entity"></Nav>
  </f7-page>
</template>


<script>
import Nav from "../../components/nav.vue";

export default {
  components: {
    Nav,
  },
  data() {
    return {
      info_user: {
        entity: "El granjero",
        user_name: "Jesus Mesias",
        id_user: 1119893100,
      },
      array_list: [],

      menu_list: [],
    };
  },

  methods: {},
};
</script>