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
            large
            color="green"
            fill
            :style="{
              width: '100%',
            }"
            @click="query_referrals"
          >
            Consultar
          </f7-button>
        </f7-list-item>
      </f7-list>
    </f7-card>

    <f7-card
      :style="{
        padding: '10px',
      }"
      v-if="detalle.length"
    >
      <f7-list form class="reimpresion_remision">
        <f7-list-item title="Listado de remisiones" group-title />

        <f7-list-item>
          <div class="list accordion-opposite width-100">
            <ul class="no-padding-left">
              <li
                class="accordion-item swipeout"
                v-for="(item, index) in detalle"
                :key="index"
              >
                <a class="item-content item-link" href="#">
                  <div class="item-inner swipeout-content">
                    <f7-row
                      no-gap
                      class="width-100 display-flex align-items-center"
                    >
                      <f7-col width="80">
                        <div
                          class="item-title"
                          :style="{ 'font-size': '12px' }"
                        >
                          <b>{{ item.cliente_fact }}</b>
                        </div>
                      </f7-col>
                      <f7-col
                        width="20"
                        class="text-align-right"
                        :style="{ 'font-size': '12px' }"
                      >
                        Fact. {{ format_num(item.numero_fact) }}
                      </f7-col>
                    </f7-row>
                  </div>

                  <div class="swipeout-actions-right">
                    <f7-link
                      icon-f7="printer"
                      icon-color="white"
                      icon-size="24"
                      class="swipeout-red"
                      color="gray"
                      @click="print_pdf(item)"
                    ></f7-link>
                  </div>
                </a>
                <div class="accordion-item-content">
                  <div class="block">
                    <f7-row>
                      <f7-col width="100">
                        <b>Prefijo:</b>
                        {{ item.pref_fact }}
                      </f7-col>

                      <f7-col width="100">
                        <b>Fecha:</b>
                        {{ item.fecha_fact }}
                      </f7-col>

                      <f7-col width="100">
                        <b>Forma de pago:</b>
                        {{ item.formapago_fact }}
                      </f7-col>

                      <f7-col width="100">
                        <b>Valor fact:</b>
                        {{ item.valor_fact }}
                      </f7-col>
                    </f7-row>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </f7-list-item>
      </f7-list>
    </f7-card>
  </f7-page>
</template>

<script>
import { format_num } from "../../js/utils/plugins";
import { current_date } from "../../js/utils/global";

import { imprimir } from "../../js/utils/print";
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
  data() {
    return {
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
      // detalle: "remisiones/get_list",
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
  },
  methods: {
    format_num,

    async query_referrals() {
      let dispatch = this.$store.dispatch;

      await dispatch("remisiones/query_referrals", this.form);
    },
    async print_pdf(item) {
      let dispatch = this.$store.dispatch;

      let data = `${item.agencia_fact}|${item.pref_fact}|${
        item.numero_fact
      }|${item.fecha_fact.substr(0, 4)}|`;

      const response = await dispatch("remisiones/post_print", data);

      const order_data = await dispatch("remisiones/order_data_print", {
        data: response.message[0],
      });

      try {
        imprimir({
          data: _.cloneDeep(order_data),
          formato: "remision_pos",
        })
          .then((base64) => {
            if (window.Capacitor) {
              window.plugins.PrintPDF.print({
                data: base64,
                type: "Data",
                title: "test print",
                success: function () {
                  console.log("success");
                },
                error: function (data) {
                  data = JSON.parse(Data);
                  console.log("failed" + data.error);
                },
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>