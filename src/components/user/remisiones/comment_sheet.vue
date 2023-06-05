<template>
  <f7-sheet
    id="comment-sheet"
    style="height: auto; --f7-sheet-bg-color: #fff"
    swipe-to-close
    swipe-to-step
    backdrop
    @sheet:closed="closed"
  >
    <f7-toolbar>
      <div class="left">
        <div
          class="display-flex padding justify-content-space-between align-items-center"
        >
          <div><b>Factura: </b></div>
          <div>
            &nbsp;
            {{ form?.numero_fact || "" }}
          </div>
        </div>
      </div>
      <div class="right">
        <f7-link sheet-close>Cerrar</f7-link>
      </div>
    </f7-toolbar>

    <f7-block-title class="margin-top" style="font-size: 16px"
      >Observación:</f7-block-title
    >

    <f7-list no-hairlines>
      <f7-list-input
        type="textarea"
        floating-label
        error-message="Campo obligatorio"
        required
        outline
        maxlength="270"
        v-model:value="form.comment"
        placeholder="Ingrese una observación"
      >
      </f7-list-input>
      <f7-list-item>
        <f7-button class="width-100" large outline @click="grabar"
          >Grabar</f7-button
        >
      </f7-list-item>
    </f7-list>
  </f7-sheet>
</template>

<script>
import { f7 } from "framework7-vue";
import { toast } from "../../../js/utils/plugins";
export default {
  props: {
    estado: false,
    params: {
      data: {},
    },
  },
  data() {
    return {
      form: {
        comment: null,
      },
      sheet: null,
    };
  },
  watch: {
    estado: function (val) {
      if (val) this.sheet.open();
      else {
        this.form = { comment: null };
        this.sheet.close();
      }
    },
    "params.data": function (val) {
      this.form = val;
    },
  },
  mounted() {
    let element = document.getElementById("comment-sheet");
    let sheet = f7.sheet.get(element);
    this.sheet = sheet;
  },
  methods: {
    grabar() {
      if (this.form.comment) this.$emit("callback", { ...this.form });
      else toast("Debe ingresar una observacion");
    },
    closed() {
      this.$emit("closed");
    },
  },
};
</script>