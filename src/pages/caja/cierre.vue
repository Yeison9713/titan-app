<template>
  <f7-page class="main-titan no-swipe-panel">
    <f7-navbar theme-dark>
      <f7-nav-left>
        <f7-link :style="{ color: '#FFF' }" icon-f7="arrow_left" back></f7-link>
      </f7-nav-left>
      <f7-nav-title>
        <f7-icon
          size="22"
          f7="money_dollar_circle"
          class="margin-right-half"
        ></f7-icon>
        Cierre de caja
      </f7-nav-title>
    </f7-navbar>

    <f7-card
      :style="{
        padding: '10px',
      }"
    >
      <f7-list>
        <f7-list-input
          label="Agencia"
          type="text"
          error-message="Campo obligatorio"
          required
          v-model:value="form.agencia.descripcion"
          :disabled="true"
        ></f7-list-input>

        <f7-list-input
          label="Fecha corte"
          type="date"
          outline
          floating-label
          v-model:value="form.fecha_corte"
        >
        </f7-list-input>

        <f7-list-item>
          <f7-button color="" class="width-100" large outline @click="consultar"
            >Consultar</f7-button
          >
        </f7-list-item>
      </f7-list>
    </f7-card>
    <popup_cierre
      :estado="popup_report.estado"
      :params="popup_report.params"
      @closed="popup_report.estado = false"
      @editPago="editPago"
    ></popup_cierre>
  </f7-page>
</template>

<script>
import { mapGetters } from "vuex";
import { current_date } from "../../js/utils/global";
import { loader } from "../../js/utils/plugins";
import popup_cierre from "./popup_cierre.vue";

export default {
  components: {
    popup_cierre,
  },
  data() {
    return {
      popup_report: {
        estado: false,
        params: {
          data: [],
        },
      },
      form: {
        agencia: {
          codigo: null,
          descripcion: null,
        },
        fecha_corte: current_date().split("/").reverse().join("-"),
        type_proccess: 1,
        customer: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      data_config: "user/get_data_config",
      box: "box/get_list",
    }),
  },

  watch: {
    data_config: function (val) {
      let { form } = this;
      let nombre = `${val.agencia.codigo} - ${val.agencia.nombre}`;

      form.agencia.codigo = val.agencia.codigo;
      form.agencia.descripcion = nombre;
    },
    box: function (val) {
      this.popup_report.params.data = val;
    },
  },
  async created() {
    let dispatch = this.$store.dispatch;

    await dispatch("user/query_data_config");
  },
  methods: {
    async consultar() {
      let dispatch = this.$store.dispatch;

      let data = {
        agencia: this.form.agencia.codigo,
        fecha: this.form.fecha_corte.replaceAll("-", ""),
      };

      loader(true);
      await dispatch("box/post_informe", data);
      await setTimeout(() => loader(false), 750);
      this.popup_report.estado = true;
    },
  },
};
</script>