<template>
  <f7-popup v-model:opened="estado" @popup:opened="open" @popup:closed="closed">
    <f7-view>
      <f7-page>
        <f7-navbar :title="`${array[0]?.descripcion_rep || 'No hay datos'}`">
          <f7-nav-right>
            <f7-link
              v-if="!params_sheet.estado"
              icon-f7="multiply"
              popup-close
            ></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-list>
          <div class="list width-100">
            <ul class="no-padding-left">
              <li v-for="(item, index) in array" :key="index">
                <label class="item-content item-checkbox">
                  <input
                    type="checkbox"
                    name="select_item"
                    :value="JSON.stringify(item)"
                    :checked="item.checked"
                    @change="addItem"
                  />
                  <i class="icon icon-checkbox"></i>

                  <div class="item-inner">
                    <f7-row
                      no-gap
                      class="width-100 display-flex align-items-center"
                    >
                      <f7-col width="80">
                        <div
                          class="item-title"
                          style="font-size: 12px; font-weight: 500"
                        >
                          {{ item.pref_rep }} - {{ item.factura_rep.trim() }}
                        </div>
                      </f7-col>
                      <f7-col
                        width="20"
                        class="text-align-right"
                        :style="{ 'font-size': '12px' }"
                      >
                        {{ format_num(item.valor_abono) }}
                      </f7-col>
                    </f7-row>
                  </div>
                </label>
              </li>
            </ul>
          </div>

          <f7-list-item
            v-if="!array.length"
            title="No hay datos"
          ></f7-list-item>
        </f7-list>

        <f7-list v-if="facturar.length">
          <div class="list accordion width-100">
            <ul class="no-padding-left">
              <li class="bg-color-green">
                <label class="item-content">
                  <div class="item-inner">
                    <div
                      class="item-title"
                      style="font-weight: 500; color: #fff"
                    >
                      Facturas a pagar
                    </div>
                  </div>
                </label>
              </li>

              <li
                class="swipeout accordion-item"
                v-for="(item, index) in facturar"
                :key="index"
              >
                <a class="item-content swipeout-content item-link" href="#">
                  <div class="item-inner">
                    <f7-row
                      no-gap
                      class="width-100 display-flex align-items-center"
                    >
                      <f7-col width="80">
                        <div
                          class="item-title"
                          style="font-size: 12px; font-weight: 500"
                        >
                          {{ item.pref_rep }} - {{ item.factura_rep.trim() }}
                        </div>
                      </f7-col>
                      <f7-col
                        width="20"
                        class="text-align-right"
                        :style="{ 'font-size': '12px' }"
                      >
                        {{ format_num(item.valor_abono) }}
                      </f7-col>
                    </f7-row>
                  </div>
                </a>

                <div class="swipeout-actions-right">
                  <f7-link
                    icon-f7="pencil"
                    icon-color="white"
                    icon-size="24"
                    class="swipeout-red"
                    color="green"
                    @click="editPago(item)"
                  ></f7-link>
                </div>

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
                        <b>Agencia:</b>
                        <div>{{ item.agencia_rep }}</div>
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
                        <b>Fecha:</b>
                        <div>{{ item.fecha_rep }}</div>
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
                        <b>Vencimiento:</b>
                        <div>{{ item.vence_rep }}</div>
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
                        <b>Dias:</b>
                        <div>{{ item.dias_rep.trim() }}</div>
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
                        <b>Por vencer:</b>
                        <div>{{ item.xvencer_rep }}</div>
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
                        <b>Vencido:</b>
                        <div>{{ item.vencido_rep }}</div>
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
                        <b>Total:</b>
                        <div>
                          {{ format_num(item.total) }}
                        </div>
                      </div>
                    </f7-list-item>
                  </div>
                </div>
              </li>

              <li>
                <div class="item-content">
                  <div class="item-inner">
                    <f7-row
                      no-gap
                      class="width-100 display-flex align-items-center"
                    >
                      <f7-col width="80">
                        <div
                          class="item-title"
                          style="font-size: 16px; font-weight: 500"
                        >
                          <b> Total: </b>
                        </div>
                      </f7-col>
                      <f7-col
                        width="20"
                        class="text-align-right"
                        :style="{ 'font-size': '16px' }"
                      >
                        <b>
                          {{ totalFacturas() }}
                        </b>
                      </f7-col>
                    </f7-row>
                  </div>
                </div>
              </li>
              <li>
                <div class="item-content">
                  <div class="item-inner">
                    <f7-row no-gap class="width-100">
                      <f7-button
                        color="green"
                        large
                        outline
                        class="width-100"
                        @click="grabar"
                      >
                        Finalizar proceso</f7-button
                      >
                    </f7-row>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </f7-list>
      </f7-page>
    </f7-view>
    <sheet_cierre
      :estado="params_sheet.estado"
      :params="params_sheet"
      @closed="params_sheet.estado = false"
      @callback="changeData"
    ></sheet_cierre>
  </f7-popup>
</template>

<script>
import _ from "lodash";
import { format_num } from "../../js/utils/plugins";
import sheet_cierre from "./sheet_cierre_caja.vue";

export default {
  props: {
    estado: Boolean,
    params: Object,
  },
  components: {
    sheet_cierre,
  },
  data() {
    return {
      params_sheet: {
        estado: false,
        data: {},
      },
      array: [],
      totales: {
        xVencer: null,
        vencido: null,
        total: null,
      },
      facturar: [],
    };
  },
  watch: {
    "params.data": function (val) {
      this.array = val || [];
      this.calcularTotales();
    },
  },
  methods: {
    format_num,
    closed() {
      this.array = [];
      this.facturar = [];
      this.$emit("closed", false);
    },

    grabar() {
      this.$emit("payup", _.cloneDeep(this.facturar));
    },

    addItem(item) {
      let element = item?.path[0] || "";
      let object = JSON.parse(element.value) || {};
      let checkbox = element.checked;

      if (checkbox) {
        this.facturar.push(object);
      } else {
        let filter = this.facturar.filter(
          (e) => e.factura_rep != object.factura_rep
        );
        this.facturar = _.cloneDeep(filter);
      }
    },

    editPago(item) {
      this.params_sheet.data = _.cloneDeep(item);
      this.params_sheet.estado = true;
    },

    changeData(data) {
      this.params_sheet.estado = false;
      this.params_sheet.data = {};

      for (const item of this.facturar) {
        if (data.factura_rep == item.factura_rep) {
          item.valor_abono = data.valor_abono;
        }
      }
      this.totalFacturas();
    },

    totalFacturas() {
      let total = 0;
      for (const item of this.facturar) {
        total += parseFloat(item.valor_abono);
      }
      return this.format_num(total);
    },

    calcularTotales() {
      let xVencer = 0;
      let vencido = 0;

      for (const item of this.array) {
        let valor1 = parseFloat(item.xvencer_rep.replace(/,/g, "")) || 0;
        let valor2 = parseFloat(item.vencido_rep.replace(/,/g, "")) || 0;

        xVencer += valor1;
        vencido += valor2;

        item.total = valor1 + valor2;
        item.valor_abono = valor1 + valor2;
      }

      this.totales.xVencer = xVencer;
      this.totales.vencido = vencido;
      this.totales.total = xVencer + vencido;
    },
  },
};
</script>