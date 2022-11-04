<template>
  <f7-sheet
    id="sheet-cierre-caja"
    style="height: auto; --f7-sheet-bg-color: #fff"
    swipe-to-close
    swipe-to-step
    backdrop
    @sheet:closed="closed"
  >
    <f7-toolbar>
      <div class="left">
        <div
          class="
            display-flex
            padding
            justify-content-space-between
            align-items-center
          "
        >
          <div><b>Factura: </b></div>
          <div>
            &nbsp;
            {{ form?.factura_rep || "" }}
          </div>
        </div>
      </div>
      <div class="right">
        <f7-link sheet-close>Cerrar</f7-link>
      </div>
    </f7-toolbar>

    <f7-block-title class="margin-top" style="font-size: 16px"
      >Valor abono:</f7-block-title
    >
    <f7-list no-hairlines>
      <f7-list-input
        type="number"
        floating-label
        error-message="Campo obligatorio"
        required
        outline
        v-model:value="form.valor_abono"
        placeholder="Valor abono"
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
import { toast } from "../../js/utils/plugins";

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
        factura_rep: null,
        valor_original: null,
        valor_abono: null,
      },
      sheet: null,
    };
  },

  watch: {
    estado: function (val) {
      if (!val) {
        this.form = {};
        this.sheet.close();
      } else {
        this.sheet.open();

        let data = { ...this.params.data };
        this.form.factura_rep = data.factura_rep;
        this.form.valor_abono = data.valor_abono;
        this.form.valor_original = data.valor_abono;
      }
    },
    "params.data": function (val) {
      this.form = val;
    },
  },

  mounted() {
    let element = document.getElementById("sheet-cierre-caja");
    let sheet = f7.sheet.get(element);
    this.sheet = sheet;
  },
  methods: {
    closed() {
      this.$emit("closed");
    },
    grabar() {
      let valor_abono = this.form.valor_abono;
      let valor_original = this.form.valor_original;

      if (parseFloat(valor_abono) > parseFloat(valor_original)) {
        console.log("ingresa");
        toast("El valor abono no puede ser mayor al de la factura");
      } else {
        this.$emit("callback", { ...this.form });
      }
    },
  },
};
</script>