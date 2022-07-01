<template>
  <f7-popup
    class="config_rut"
    v-model:opened="estado"
    @popup:opened="open"
    @popup:closed="closed"
  >
    <f7-view>
      <f7-page>
        <f7-navbar title="Informe">
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-list accordion-list>
          <f7-list-item accordion-item title="Nested List">
            <f7-accordion-content>
              <f7-list>
                <f7-list-item title="Item 1"></f7-list-item>
                <f7-list-item title="Item 2"></f7-list-item>
                <f7-list-item title="Item 3"></f7-list-item>
                <f7-list-item title="Item 4"></f7-list-item>
              </f7-list>
            </f7-accordion-content>
          </f7-list-item>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>

<script>
export default {
  props: {
    estado: Boolean,
    params: Object,
  },
  data() {
    return {};
  },
  methods: {
    open() {
      console.log("open");
    },
    closed() {
      this.$emit("closed", false);
    },
  },
};
</script>