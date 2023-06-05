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

        <f7-list>
          <f7-list-item
            v-for="item in array"
            :key="item"
            :title="item.descripprod_rep"
            :after="item.cant_rep || 0"
          >
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
    data: Array,
  },
  data() {
    return {
      array: [],
    };
  },
  watch: {
    data: function (val) {
      this.array = val || [];
    },
  },
};
</script>