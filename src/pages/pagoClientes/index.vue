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
        Pago clientes
      </f7-nav-title>
    </f7-navbar>

    <f7-card
      :style="{
        padding: '10px',
      }"
    >
      <f7-list>
        <f7-list-input
          label="Punto de entrega"
          type="text"
          error-message="Campo obligatorio"
          required
          v-model:value="form.agencia.descripcion"
          :disabled="true"
        ></f7-list-input>

        <f7-list-item-row>
          <f7-row no-gap :style="{ width: '100%' }">
            <f7-col width="80">
              <f7-list-input
                label="Cliente"
                type="text"
                outline
                floating-label
                :value="form.customer?.descripcion_rut"
                disabled
              />
            </f7-col>
            <f7-col
              width="20"
              :style="{ height: '100%' }"
              class="display-flex align-items-center padding-right"
            >
              <f7-button
                fill
                color="green"
                :style="{ width: '100%', 'margin-top': '8px' }"
                @click="searchState = true"
              >
                <f7-icon f7="search" size="22"></f7-icon>
              </f7-button>
            </f7-col>
          </f7-row>
        </f7-list-item-row>

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
    <popup_report
      :estado="popup_report.estado"
      :params="popup_report.params"
      @closed="popup_report.estado = false"
      @payup="payup"
    ></popup_report>

    <popup_pago
      :estado="popup_pago.estado"
      :params="popup_pago.params"
      @closed="popup_pago.estado = false"
    ></popup_pago>

    <lookup
      :estado="searchState"
      :params="searchParams"
      @callback="selectClient"
      @closed="searchState = false"
    />
  </f7-page>
</template>

<script>
import { mapGetters } from "vuex";
import { current_date } from "../../js/utils/global";
import { loader, toast } from "../../js/utils/plugins";
import popup_report from "./popup.vue";
import popup_pago from "./popup_pago.vue";
import lookup from "../../components/user/lookup.vue";
export default {
  components: {
    popup_report,
    popup_pago,
    lookup,
  },
  data() {
    return {
      searchState: false,
      searchParams: {
        text: "Clientes",
        vuex: {
          getter: "customers/get_list",
        },
        columns: {
          text: "descripcion_rut",
          value: ["identificacion_rut"],
        },
      },
      popup_report: {
        estado: false,
        params: {
          data: [],
        },
      },
      popup_pago: {
        estado: false,
        params: {
          data: {},
        },
      },
      rut_procedure: [
        { value: 1, text: "Todo los ruts" },
        { value: 2, text: "Selecion unica" },
      ],
      assessor_procedure: [
        { value: 1, text: "Todo los asesores" },
        { value: 2, text: "Selecion unica" },
      ],
      form: {
        agencia: {
          codigo: null,
          descripcion: null,
        },
        fecha_corte: current_date().split("/").reverse().join("-"),
        customer: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      data_config: "user/get_data_config",
      cartera: "cartera/get_list",
    }),
  },
  watch: {
    data_config: function (val) {
      let { form } = this;
      let nombre = `${val.agencia.codigo} - ${val.agencia.nombre}`;

      form.agencia.codigo = val.agencia.codigo;
      form.agencia.descripcion = nombre;
    },
    cartera: function (val) {
      this.popup_report.params.data = val;
    },
  },
  async created() {
    let dispatch = this.$store.dispatch;

    await dispatch("user/query_data_config");
    await dispatch("customers/query_list");
  },

  methods: {
    async consultar() {
      let dispatch = this.$store.dispatch;

      let data = {
        agencia: this.form.agencia.codigo,
        rut: this.form.customer,
        fecha: this.form.fecha_corte.replaceAll("-", ""),
      };

      if (!this.form.customer) {
        toast("Selecione el rut");
      } else {
        loader(true);
        await dispatch("cartera/post_informe", data);
        await setTimeout(() => loader(false), 500);
        this.popup_report.estado = true;
      }
    },
    capitalize(str = "") {
      const array = str.toLowerCase().split(" ");

      for (var i = 0; i < array.length; i++) {
        array[i] = array[i].charAt(0).toUpperCase() + array[i].slice(1);
      }

      return array.join(" ");
    },
    textValue(obj, id, field = "value", resolve = "text") {
      let retornar = this[obj]?.find((e) => e[field] == id);

      if (!retornar || retornar?.text) return retornar?.text || "";
      else return retornar[resolve] || "";
    },
    payup(data) {
      this.popup_report.estado = false;
      this.popup_pago.params.data = data;
      setTimeout(() => (this.popup_pago.estado = true), 500);
    },
    selectClient(item) {
      this.form.customer = item;
      this.searchState = false;
    },
  },
};
</script>