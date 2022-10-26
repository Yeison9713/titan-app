<template>
  <f7-popup
    class="config_rut"
    v-model:opened="estado"
    @popup:opened="open"
    @popup:closed="closed"
  >
    <f7-view>
      <f7-page>
        <f7-navbar title="Remisiones">
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-card>
          <f7-list form class="reimpresion_remision">
            <f7-list-item>
              <div class="list accordion-opposite width-100">
                <ul class="no-padding-left">
                  <li
                    class="accordion-item swipeout"
                    v-for="(item, index) in array"
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
    </f7-view>
  </f7-popup>
</template>

<script>
import { format_num } from "../../../js/utils/plugins";
import { imprimir } from "../../../js/utils/print";
import _ from "lodash";
import { mapGetters } from "vuex";

export default {
  props: {
    estado: Boolean,
    params: Object,
  },
  data() {
    return {
      array: [],
      totales: {
        xVencer: null,
        vencido: null,
        total: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      info_user: "middleware/get_info",
    }),
  },
  methods: {
    format_num,
    open() {
      this.array = this.params.data || [];
    },
    closed() {
      this.$emit("closed", false);
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
          data: _.cloneDeep({
            ...order_data,
            elaboro: {
              fecha: new Date().getTime(),
              operador: this.info_user.user,
            },
          }),
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