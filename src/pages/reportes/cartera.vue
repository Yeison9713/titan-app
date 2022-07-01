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
          v-model:value="form.agencia"
          :disabled="true"
        ></f7-list-input>

        <f7-list-item
          title="Rut a procesar"
          smart-select
          :smart-select-params="{
            closeOnSelect: true,
            setValueText: false,
          }"
        >
          <select name="rut_procedure">
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
        >
          <select name="customers">
            <option
              v-for="item in customers"
              :key="item.identificacion_rut"
              :value="item.identificacion_rut"
            >
              {{ capitalize(item.descripcion_rut) }}
            </option>
          </select>
        </f7-list-item>

        <f7-list-item
          title="Asesor a procesar"
          smart-select
          :disabled="true"
          :smart-select-params="{
            closeOnSelect: true,
            setValueText: false,
          }"
        >
          <select name="assessor_procedure">
            <option
              v-for="item in assessor_procedure"
              :key="item.value"
              :value="item.value"
            >
              {{ item.text }}
            </option>
          </select>
        </f7-list-item>

        <f7-list-input
          label="Fecha de corte"
          type="datepicker"
          readonly
        ></f7-list-input>

        <f7-list-item>
          <f7-button color="" class="width-100" large outline
            >Consultar</f7-button
          >
        </f7-list-item>
        <f7-list-item>
          <f7-button
            color="teal"
            class="width-100"
            large
            outline
            @click="popup_report.estado = true"
            >Ver datos informe</f7-button
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
import popup_report from "../../components/user/popup_report.vue";
export default {
  components: {
    popup_report,
  },
  data() {
    return {
      popup_report: {
        estado: false,
        params: {},
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
        agencia: "00002 - Ruta 1",
      },
    };
  },
  computed: {
    ...mapGetters({
      customers: "customers/get_list",
    }),
  },
  async created() {
    let dispatch = this.$store.dispatch;
    await dispatch("customers/query_list");
  },
  methods: {
    capitalize(str = "") {
      const array = str.toLowerCase().split(" ");

      for (var i = 0; i < array.length; i++) {
        array[i] = array[i].charAt(0).toUpperCase() + array[i].slice(1);
      }

      return array.join(" ");
    },
  },
};
</script>