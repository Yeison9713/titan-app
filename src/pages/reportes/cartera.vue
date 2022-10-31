<template>
  <f7-page class="main-titan no-swipe-panel">
    <f7-navbar theme-dark>
      <f7-nav-left>
        <f7-link :style="{ color: '#FFF' }" icon-f7="arrow_left" back></f7-link>
      </f7-nav-left>

      <f7-nav-title>
        <f7-icon size="22" f7="briefcase" class="margin-right-half"></f7-icon>
        Reporte cartera
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

        <f7-list-item
          title="Rut a procesar"
          smart-select
          :smart-select-params="{
            closeOnSelect: true,
            setValueText: false,
          }"
          :after="textValue('rut_procedure', form.type_proccess)"
        >
          <select name="rut_procedure" v-model="form.type_proccess">
            <option
              v-for="item in rut_procedure"
              :key="item.value"
              :value="item.value"
            >
              {{ item.text }}
            </option>
          </select>
        </f7-list-item>

        <f7-list-item
          title="Selecione el Rut"
          smart-select
          :smart-select-params="{
            closeOnSelect: true,
            setValueText: false,
          }"
          :after="
            textValue(
              'customers',
              form.customer,
              'identificacion_rut',
              'descripcion_rut'
            )
          "
          v-if="form.type_proccess == 2 ? true : false"
        >
          <select name="customers" v-model="form.customer">
            <option
              v-for="item in customers"
              :key="item.identificacion_rut"
              :value="item.identificacion_rut"
            >
              {{ capitalize(item.descripcion_rut) }}
            </option>
          </select>
        </f7-list-item>

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
    ></popup_report>
  </f7-page>
</template>

<script>
import { mapGetters } from "vuex";
import popup_report from "../../components/user/cartera/popup_report.vue";
import { current_date } from "../../js/utils/global";
import { loader } from "../../js/utils/plugins";
export default {
  components: {
    popup_report,
  },
  data() {
    return {
      popup_report: {
        estado: false,
        params: {
          data: [],
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
        type_proccess: 1,
        customer: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      data_config: "user/get_data_config",
      customers: "customers/get_list",
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
        rut: this.form.type_proccess == 1 ? 0 : this.form.customer,
        fecha: this.form.fecha_corte.replaceAll("-", ""),
      };

      loader(true);
      await dispatch("cartera/post_informe", data);
      await setTimeout(() => loader(false), 750);
      this.popup_report.estado = true;
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
  },
};
</script>