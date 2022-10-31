<template>
  <f7-popup
    class="config_rut"
    v-model:opened="estado"
    @popup:opened="open"
    @popup:closed="closed"
  >
    <f7-view>
      <f7-page>
        <f7-navbar title="Informe">
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-list accordion-list>
          <f7-list-item
            accordion-item
            v-for="(item, index) in array"
            :key="item"
            :title="item.descripcion_rep"
            :style="{
              background: `${index % 2 ? '#fff' : 'rgb(142 142 147 / 28%)'} `,
            }"
          >
            <f7-accordion-content>
              <f7-list>
                <f7-list-item>
                  <div
                    class="width-100 display-flex justify-content-space-between"
                  >
                    <b>Agencia:</b>
                    <div>{{ item.agencia_rep }}</div>
                  </div>
                </f7-list-item>
                <f7-list-item>
                  <div
                    class="width-100 display-flex justify-content-space-between"
                  >
                    <b>Prefijo:</b>
                    <div>{{ item.pref_rep }}</div>
                  </div>
                </f7-list-item>
                <f7-list-item>
                  <div
                    class="width-100 display-flex justify-content-space-between"
                  >
                    <b>Factura:</b>
                    <div>{{ item.factura_rep }}</div>
                  </div>
                </f7-list-item>
                <f7-list-item>
                  <div
                    class="width-100 display-flex justify-content-space-between"
                  >
                    <b>Fecha:</b>
                    <div>{{ item.fecha_rep }}</div>
                  </div>
                </f7-list-item>
                <f7-list-item>
                  <div
                    class="width-100 display-flex justify-content-space-between"
                  >
                    <b>Vencimiento:</b>
                    <div>{{ item.vence_rep }}</div>
                  </div>
                </f7-list-item>
                <f7-list-item>
                  <div
                    class="width-100 display-flex justify-content-space-between"
                  >
                    <b>Dias:</b>
                    <div>{{ item.dias_rep.trim() }}</div>
                  </div>
                </f7-list-item>
                <f7-list-item>
                  <div
                    class="width-100 display-flex justify-content-space-between"
                  >
                    <b>Por vencer:</b>
                    <div>{{ item.xvencer_rep }}</div>
                  </div>
                </f7-list-item>
                <f7-list-item>
                  <div
                    class="width-100 display-flex justify-content-space-between"
                  >
                    <b>Vencido:</b>
                    <div>{{ item.vencido_rep }}</div>
                  </div>
                </f7-list-item>
                <f7-list-item>
                  <div
                    class="width-100 display-flex justify-content-space-between"
                  >
                    <b>Total:</b>
                    <div>{{ item.xvencer_rep || item.vence_rep }}</div>
                  </div>
                </f7-list-item>
              </f7-list>
            </f7-accordion-content>
          </f7-list-item>
          <f7-list-item
            v-if="!array.length"
            title="No hay datos"
          ></f7-list-item>
        </f7-list>

        <f7-list accordion-list v-if="totales.total">
          <f7-list-item accordion-item title="Totales">
            <f7-accordion-content>
              <f7-list>
                <f7-list-item>
                  <div
                    class="width-100 display-flex justify-content-space-between"
                  >
                    <b>Por vencer:</b>
                    <div>{{ format_num(totales.xVencer) }}</div>
                  </div>
                </f7-list-item>
                <f7-list-item>
                  <div
                    class="width-100 display-flex justify-content-space-between"
                  >
                    <b>Vencido:</b>
                    <div>{{ format_num(totales.vencido) }}</div>
                  </div>
                </f7-list-item>
                <f7-list-item>
                  <div
                    class="width-100 display-flex justify-content-space-between"
                  >
                    <b>Total:</b>
                    <div>{{ format_num(totales.total) }}</div>
                  </div>
                </f7-list-item>
              </f7-list>
            </f7-accordion-content>
          </f7-list-item>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>

<script>
import { format_num } from "../../../js/utils/plugins";
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
  watch: {
    "params.data": function (val) {
      this.array = this.params.data || [];
      this.calcularTotales();
    },
  },
  methods: {
    format_num,
    open() {
      // this.array = this.params.data || [];
      // this.calcularTotales();
    },
    closed() {
      this.$emit("closed", false);
    },
    calcularTotales() {
      let xVencer = 0;
      let vencido = 0;

      for (const item of this.array) {
        xVencer += parseFloat(item.xvencer_rep.replace(/,/g, "")) || 0;
        vencido += parseFloat(item.vencido_rep.replace(/,/g, "")) || 0;
      }

      this.totales.xVencer = xVencer;
      this.totales.vencido = vencido;
      this.totales.total = xVencer + vencido;
    },
  },
};
</script>