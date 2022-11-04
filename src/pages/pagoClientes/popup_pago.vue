<template>
  <f7-popup v-model:opened="estado" @popup:opened="open" @popup:closed="closed">
    <f7-view>
      <f7-page>
        <f7-navbar :title="form.descripcion_rep">
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-list>
          <f7-list-item-row>
            <f7-row no-gap>
              <f7-col width="65">
                <f7-list-input
                  label="Punto de entrega"
                  type="text"
                  error-message="Campo obligatorio"
                  required
                  v-model:value="form.agencia.descripcion"
                  :disabled="true"
                ></f7-list-input>
              </f7-col>
              <f7-col width="35">
                <f7-list-input
                  label="consecutivo"
                  class="input_consecutive"
                  type="text"
                  error-message="Campo obligatorio"
                  required
                  v-model:value="form.agencia.consecutivo"
                  :disabled="true"
                ></f7-list-input>
              </f7-col>
            </f7-row>
          </f7-list-item-row>

          <f7-list-item title="Detalle" group-title />

          <f7-list-item v-for="item in facturas" :key="item" :title="``">
            <div class="display-flex justify-content-space-between width-100">
              <div class="item-title" style="font-size: 12px; font-weight: 500">
                {{ item.pref_rep }} - {{ item.factura_rep.trim() }}
              </div>
              <div class="text-align-right" :style="{ 'font-size': '12px' }">
                {{ format_num(item.valor_abono) }}
              </div>
            </div>
          </f7-list-item>

          <f7-list-item>
            <div class="display-flex justify-content-space-between width-100">
              <div class="item-title" style="font-size: 16px; font-weight: 500">
                Total:
              </div>
              <div class="text-align-right" :style="{ 'font-size': '16px' }">
                {{ format_num(totales.valor_abono) }}
              </div>
            </div>
          </f7-list-item>

          <f7-list-item title="Datos a ingresar" group-title />

          <f7-list-item-row>
            <f7-row no-gap :style="{ width: '100%' }">
              <f7-col>
                <f7-list-input
                  label="Valor efectivo"
                  type="number"
                  floating-label
                  error-message="Campo obligatorio"
                  required
                  outline
                  v-model:value="form.efectivo"
                >
                </f7-list-input>
              </f7-col>

              <f7-col>
                <f7-list-input
                  label="Valor transferencia"
                  type="number"
                  floating-label
                  error-message="Campo obligatorio"
                  required
                  outline
                  v-model:value="form.transferencia"
                >
                </f7-list-input>
              </f7-col>
            </f7-row>
          </f7-list-item-row>

          <f7-list-input
            label="Banco transferencia"
            type="select"
            floating-label
            outline
            v-model:value="form.bancoTransferencia"
          >
            <option value="01">Banco de Bogotá</option>
            <option value="07">Bancolombia</option>
            <option value="51">Davivienda</option>
          </f7-list-input>

          <f7-list-input
            label="Observaciones"
            type="textarea"
            floating-label
            outline
            v-model:value="form.observaciones"
          >
          </f7-list-input>

          <f7-list-item>
            <f7-button class="width-100" large outline @click="grabar"
              >Grabar</f7-button
            >
          </f7-list-item>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>

<script>
import { mapGetters } from "vuex";
import { current_date } from "../../js/utils/global";
import { format_num, loader, toast } from "../../js/utils/plugins";
import { imprimir } from "../../js/utils/print";
import _ from "lodash";
export default {
  props: {
    estado: Boolean,
    params: Object,
  },
  data() {
    return {
      form: {
        efectivo: null,
        transferencia: null,
        bancoTransferencia: null,
        observaciones: null,
        agencia: {
          codigo: null,
          nombre: null,
          consecutivo: null,
          descripcion: null,
        },
      },
      facturas: [],
      totales: {
        valor_abono: null,
      },
    };
  },
  watch: {
    "params.data": async function (val) {
      let dispatch = this.$store.dispatch;

      let data = val ? val[0] : {};
      this.form = {
        ...data,
        efectivo: null,
        transferencia: null,
        bancoTransferencia: null,
        observaciones: null,
        agencia: {
          codigo: null,
          nombre: null,
          consecutivo: null,
          descripcion: null,
        },
      };

      this.facturas = val;
      await dispatch("agencies/download");
      await dispatch("remisiones/validate_consecutive", "1");
      this.calcularTotales();
    },

    consecutive: function (val) {
      let { agencia } = val;
      this.form.agencia = { ...agencia };
      this.form.agencia.descripcion = agencia.codigo + " - " + agencia.nombre;
    },
  },
  computed: {
    ...mapGetters({
      setting: "setting/get_data",
      consecutive: "remisiones/get_consecutive",
      info_user: "middleware/get_info",
    }),
  },
  methods: {
    format_num,
    closed() {
      this.form = {
        agencia: {},
      };
      this.facturas = [];
      this.totales = {
        valor_abono: null,
      };
      this.$emit("closed", false);
    },
    async grabar() {
      try {
        let efectivo = this.form.efectivo || 0;
        let transferencia = this.form.transferencia || 0;
        let banco = this.form.bancoTransferencia || "";
        let total = this.totales.valor_abono;

        let total_pago = parseFloat(efectivo) + parseFloat(transferencia);

        if (!total_pago) {
          toast("Debe ingresar un valor, en efectivo o transferencia");
        } else if (total_pago != parseFloat(total)) {
          toast(
            "El valor del pago no puede ser diferente al total del detalle"
          );
        } else if (transferencia && !banco) {
          toast("Debe selecionar un banco");
        } else {
          loader(true);
          let data = this.order_data_send();
          let response = await this.$store.dispatch(
            "remisiones/pay_customer",
            data
          );
          toast("Pago registrado correctamente");
          loader(false);
          this.print(response.message[0]);
        }
      } catch (error) {
        loader(false);
        console.log(error);
      }
    },
    async print(consecutivo) {
      let data_send = {
        date: current_date().split("/").reverse().join(""),
        agencia: this.form.agencia.codigo,
        consecutivo,
      };

      let dispatch = this.$store.dispatch;

      let data = await dispatch("remisiones/print_recaudo", data_send);

      imprimir({
        data: _.cloneDeep(data.message[0]),
        formato: "recaudo_pos",
        nit: this.info_user.company.id,
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

          this.closed();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    order_data_send() {
      let date = current_date().split("/").reverse().join("");

      let efectivo = this.form.efectivo || 0;
      let transferencia = this.form.transferencia || 0;
      let banco = this.form.bancoTransferencia || "";
      let observaciones = this.form.observaciones || "";

      let consecutivo = this.form.agencia.consecutivo || "";
      let agencia = this.form.agencia.codigo;
      let cliente = this.form?.id_rep || "";

      let data_send = `|5|${consecutivo}|${agencia}|${cliente}|${date}|${efectivo}|${transferencia}|${banco}|${observaciones}|`;

      let detalle = {};

      this.facturas?.forEach((k, v) => {
        let index = v + 1;
        let name = `DATOJ-${String(index).padStart(3, "0")}`;

        let prefijo = k.pref_rep;
        let factura = k.factura_rep?.trim() || "";
        let vlr_abono = k.valor_abono || 0;

        detalle[name] = `${prefijo}|${factura}|${vlr_abono}|`;
      });

      return { data_send, detalle };
    },
    calcularTotales() {
      let valor_abono = 0;

      for (const item of this.facturas) {
        valor_abono += parseFloat(item.valor_abono) || 0;
      }

      this.totales.valor_abono = valor_abono;
      this.form.efectivo = valor_abono;
    },
  },
};
</script>