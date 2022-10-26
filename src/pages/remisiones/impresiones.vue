<template>
  <f7-page>
    <f7-navbar title="Reimpresion de remisiones" back-link="Back"></f7-navbar>
    <f7-card
      :style="{
        padding: '10px',
      }"
    >
      <f7-list form class="reimpresion_remision">
        <f7-list-item title="Consultar remisiones" group-title />

        <f7-list-input
          label="Punto de remisión"
          type="text"
          floating-label
          error-message="Campo obligatorio"
          required
          outline
          v-model:value="form.agencia.descripcion"
          :disabled="true"
        >
        </f7-list-input>

        <f7-list-item-row>
          <f7-row no-gap>
            <f7-col>
              <f7-list-input
                label="Fecha inicial"
                type="date"
                outline
                floating-label
                v-model:value="form.fecha_ini"
              >
              </f7-list-input>
            </f7-col>
            <f7-col>
              <f7-list-input
                label="Fecha final"
                type="date"
                outline
                floating-label
                v-model:value="form.fecha_fin"
              >
              </f7-list-input>
            </f7-col>
          </f7-row>
        </f7-list-item-row>

        <f7-list-item>
          <f7-button
            color=""
            class="width-100"
            large
            outline
            @click="query_referrals"
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
            >Ver remisiones</f7-button
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
import { loader } from "../../js/utils/plugins";
import { current_date } from "../../js/utils/global";

import { mapGetters } from "vuex";
import popup_report from "../../components/user/remisiones/popup_remisiones.vue";

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
      form: {
        agencia: {
          codigo: null,
          descripcion: null,
        },
        fecha_ini: current_date().split("/").reverse().join("-"),
        fecha_fin: current_date().split("/").reverse().join("-"),
      },
    };
  },
  async created() {
    let dispatch = this.$store.dispatch;

    await dispatch("user/query_data_config");
    await dispatch("agencies/download");
    await dispatch("remisiones/query_list");
    await dispatch("setting/query_data");
  },
  computed: {
    ...mapGetters({
      data_config: "user/get_data_config",
      detalle: "remisiones/get_referrals",
      info_user: "middleware/get_info",
    }),
  },
  watch: {
    data_config: function (val) {
      let { form } = this;
      let nombre = `${val.agencia.codigo} - ${val.agencia.nombre}`;

      form.agencia.codigo = val.agencia.codigo;
      form.agencia.descripcion = nombre;
    },
    detalle: function (val) {
      this.popup_report.params.data = val;
    },
  },
  methods: {
    async query_referrals() {
      let dispatch = this.$store.dispatch;
      loader(true);
      await dispatch("remisiones/query_referrals", this.form);
      setTimeout(() => loader(false), 750);
    },
  },
};
</script>