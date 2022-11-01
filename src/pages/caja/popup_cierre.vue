<template>
  <f7-popup
    class="config_rut"
    v-model:opened="estado"
    @popup:opened="open"
    @popup:closed="closed"
  >
    <f7-view>
      <f7-page>
        <f7-navbar title="Cierre de caja">
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-card>
          <f7-list form>
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
                          <f7-col width="60">
                            <div
                              class="item-title"
                              :style="{ 'font-size': '12px' }"
                            >
                              <b>Punto recaudo:</b> {{ item.agencia_rep }}
                            </div>
                          </f7-col>
                          <f7-col
                            width="40"
                            class="text-align-right"
                            :style="{ 'font-size': '12px' }"
                          >
                            <b>Ventas:</b> {{ calcularVentas(item) }}
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
                        <f7-list-item>
                          <div
                            class="
                              width-100
                              display-flex
                              justify-content-space-between
                            "
                          >
                            <b>Recaudos:</b>
                            <div>{{ item.rec_efectivo_rep }}</div>
                          </div>
                        </f7-list-item>
                        <f7-list-item>
                          <div
                            class="
                              width-100
                              display-flex
                              justify-content-space-between
                            "
                          >
                            <b>Pago anticipado:</b>
                            <div>{{ item.ant_efectivo_rep }}</div>
                          </div>
                        </f7-list-item>
                        <f7-list-item>
                          <div
                            class="
                              width-100
                              display-flex
                              justify-content-space-between
                            "
                          >
                            <b>Efectivo:</b>
                            <div>{{ item.vta_efectivo_rep }}</div>
                          </div>
                        </f7-list-item>
                        <f7-list-item>
                          <div
                            class="
                              width-100
                              display-flex
                              justify-content-space-between
                            "
                          >
                            <b>Transferencia:</b>
                            <div>{{ item.vta_transf_rep }}</div>
                          </div>
                        </f7-list-item>
                        <f7-list-item>
                          <div
                            class="
                              width-100
                              display-flex
                              justify-content-space-between
                            "
                          >
                            <b>Egresos:</b>
                            <div>{{ calcularEgreso(item.egresos) }}</div>
                          </div>
                        </f7-list-item>
                        <f7-list-item>
                          <div
                            class="
                              width-100
                              display-flex
                              justify-content-space-between
                            "
                          >
                            <b>Total entregado:</b>
                            <div>{{ item.vta_efectivo_rep }}</div>
                          </div>
                        </f7-list-item>
                      </div>
                    </div>
                  </li>
                  <li v-if="!array.length">
                    <a class="item-content" href="#">
                      <div class="item-inner swipeout-content">
                        <f7-row
                          no-gap
                          class="width-100 display-flex align-items-center"
                        >
                          <f7-col width="100">
                            <div
                              class="item-title"
                              :style="{ 'font-size': '12px' }"
                            >
                              <b>No hay datos</b>
                            </div>
                          </f7-col>
                        </f7-row>
                      </div>
                    </a>
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
import _ from "lodash";
import { mapGetters } from "vuex";
import { format_num, loader } from "../../js/utils/plugins";
import { imprimir } from "../../js/utils/print";
export default {
  props: {
    estado: Boolean,
    params: Object,
  },
  data() {
    return {
      array: [],
    };
  },
  computed: {
    ...mapGetters({
      info_user: "middleware/get_info",
    }),
  },
  watch: {
    "params.data": function (val) {
      this.array = val || [];
    },
  },
  methods: {
    format_num,
    closed() {
      this.$emit("closed", false);
    },
    print_pdf(item) {
      try {
        imprimir({
          data: _.cloneDeep(this.calcularTotales(item)),
          formato: "close_box",
          nit: this.info_user.company.id,
        })
          .then((base64) => {
            if (window.Capacitor) {
              window.plugins.PrintPDF.print({
                data: base64,
                type: "Data",
                title: "Cierre caja",
                success: function () {
                  console.log("success");
                },
                error: function (data) {
                  data = JSON.parse(Data);
                  console.log("failed" + data.error);
                },
              });
            }

            loader(false);
          })
          .catch((err) => {
            console.log(err);
            loader(false);
          });
      } catch (error) {
        console.log(error);
        loader(false);
      }
    },
    calcularTotales(item) {
      let total = 0;
      item.tventas_rep = this.calcularVentas(item);

      let rec_efectivo_rep =
        item?.rec_efectivo_rep?.trim().replace(/,/g, "") || 0;
      let rec_transf_rep = item?.rec_transf_rep?.trim().replace(/,/g, "") || 0;
      total = parseFloat(rec_efectivo_rep) + parseFloat(rec_transf_rep);
      item.trecaudo_rep = format_num(total);

      let ant_efectivo_rep =
        item?.ant_efectivo_rep?.trim().replace(/,/g, "") || 0;
      let ant_transf_rep = item?.ant_transf_rep?.trim().replace(/,/g, "") || 0;
      total = parseFloat(ant_efectivo_rep) + parseFloat(ant_transf_rep);
      item.tpagoant_rep = format_num(total);

      let vta_efectivo_rep = item?.vta_efectivo_rep?.trim() || 0;
      let vta_transf_rep = item?.vta_transf_rep?.trim() || 0;

      item.efectivo_rep = vta_efectivo_rep;
      item.transferencia_rep = vta_transf_rep;

      item.tegresos_rep = this.calcularEgreso(item.egresos);
      item.tentregado_rep = item.efectivo_rep;

      return item;
    },
    calcularVentas(item) {
      let efectivo = item?.vta_efectivo_rep?.trim().replace(/,/g, "");
      let credito = item?.vta_credito_rep?.trim().replace(/,/g, "");
      let transferencia = item?.vta_transf_rep?.trim().replace(/,/g, "");

      let venta =
        parseFloat(efectivo) + parseFloat(credito) + parseFloat(transferencia);

      return this.format_num(venta.toFixed(0));
    },
    calcularEgreso(array) {
      let total = 0;

      for (const item of array) {
        total += parseFloat(item.egr_valor_rep.replace(/,/g, ""));
      }

      return format_num(total);
    },
  },
};
</script>