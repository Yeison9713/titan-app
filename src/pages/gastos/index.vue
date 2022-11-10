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
        Egresos
      </f7-nav-title>
    </f7-navbar>

    <f7-card
      :style="{
        padding: '10px',
      }"
    >
      <f7-list>
        <f7-list-item-row>
          <f7-row no-gap>
            <f7-col width="60">
              <f7-list-input
                label="Punto de entrega"
                type="text"
                floating-label
                outline
                :disabled="true"
                v-model:value="form.agencie.descripcion"
              >
              </f7-list-input>
            </f7-col>
            <f7-col width="40">
              <f7-list-input
                label="Consecutivo"
                class="input_consecutive"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.consecutive"
              />
            </f7-col>
          </f7-row>
        </f7-list-item-row>

        <f7-list-input
          label="Fecha"
          type="date"
          outline
          floating-label
          v-model:value="form.fecha"
        />

        <f7-list-item-row>
          <f7-button
            fill
            color="blue"
            :style="{ width: '100%' }"
            small
            class="margin"
            @click="openAddItem"
          >
            <f7-icon f7="cart" size="18" class="margin-right-half"></f7-icon>
            Agregar detalle
          </f7-button>
        </f7-list-item-row>

        <f7-list-item title="Detalle" group-title />

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
                      <f7-col width="70">
                        <div
                          class="item-title"
                          :style="{ 'font-size': '12px' }"
                        >
                          <b>{{ item.concepto?.descrip_conc }}</b>
                        </div>
                      </f7-col>
                      <f7-col
                        width="30"
                        class="text-align-right"
                        :style="{ 'font-size': '12px' }"
                      >
                        $ {{ format_num(item.valor) }}
                      </f7-col>
                    </f7-row>
                  </div>

                  <div class="swipeout-actions-right">
                    <f7-link
                      icon-f7="multiply"
                      icon-color="white"
                      icon-size="24"
                      class="swipeout-red"
                      color="red"
                      @click="delete_item(index)"
                    ></f7-link>
                  </div>
                </a>
                <div class="accordion-item-content">
                  <div class="block">
                    <f7-row>
                      <f7-col width="100">
                        <b>Nro. Factura:</b>
                        {{ item.nro_fact }}
                      </f7-col>

                      <f7-col width="100">
                        <b>Cliente:</b>
                        {{ item.cliente.descripcion_rut }}
                      </f7-col>
                    </f7-row>
                  </div>
                </div>
              </li>

              <li v-if="form.total">
                <a class="item-content" href="#">
                  <div class="item-inner">
                    <f7-row
                      no-gap
                      class="width-100 display-flex align-items-center"
                    >
                      <f7-col width="70">
                        <div
                          class="item-title"
                          :style="{ 'font-size': '12px' }"
                        >
                          <b>Total: </b>
                        </div>
                      </f7-col>
                      <f7-col
                        width="30"
                        class="text-align-right"
                        :style="{ 'font-size': '12px' }"
                      >
                        $ {{ format_num(form.total) }}
                      </f7-col>
                    </f7-row>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </f7-list-item>

        <f7-list-input
          label="Observaciones"
          type="textarea"
          floating-label
          outline
          v-model:value="form.observaciones"
        />

        <f7-block strong>
          <f7-row>
            <f7-col>
              <f7-button fill color="green" @click="grabar">Grabar </f7-button>
            </f7-col>
          </f7-row>
        </f7-block>
      </f7-list>
    </f7-card>
    <addDetalle
      :estado="modalAddItem.estado"
      @closed="modalAddItem.estado = false"
      @callback="add_detalle"
    ></addDetalle>
  </f7-page>
</template>

<script>
import { current_date } from "../../js/utils/global";
import _ from "lodash";
import { mapGetters, mapActions } from "vuex";

import addDetalle from "./addDetalle.vue";
import { format_num, loader, toast } from "../../js/utils/plugins";
import { imprimir } from "../../js/utils/print";

export default {
  components: {
    addDetalle,
  },
  data() {
    return {
      modalAddItem: {
        estado: false,
      },
      form: {
        agencie: {
          codigo: null,
          descripcion: null,
        },
        consecutive: null,
        fecha: current_date().split("/").reverse().join("-"),
        total: null,
        observaciones: null,
      },
      detalle: [],
    };
  },
  computed: {
    ...mapGetters({
      info_user: "setting/get_data",
      agencies: "agencies/get_list",
      info: "middleware/get_info",
    }),
  },

  async created() {
    let dispatch = this.$store.dispatch;
    loader(true);
    await dispatch("setting/query_data");
    await dispatch("agencies/download");
    await dispatch("customers/query_list");
    await dispatch("concepts/query");

    this.init();
  },
  methods: {
    format_num,
    init() {
      let ptoperfil_empr = this.info_user?.ptoperfil_empr;
      let agencie = this.agencies.find((e) => e.codigo_agc == ptoperfil_empr);

      this.form.agencie.codigo = agencie?.codigo_agc || "";
      this.form.agencie.descripcion = `${agencie?.codigo_agc} - ${agencie.descripcion_agc}`;
      this.get_consecutive();
    },

    get_consecutive() {
      let date = current_date().split("/").reverse().join("");
      let data = `1|${this.form.agencie.codigo}|051|${date}|`;

      this.$store
        .dispatch("setting/get_consecutive", data)
        .then((res) => {
          this.form.consecutive = res.message[0]?.nro_cons?.trim() || "";
          loader(false);
        })
        .catch((error) => {
          console.log(error);
          loader(false);
        });
    },
    add_detalle(item) {
      this.detalle.push(_.cloneDeep(item));
      this.modalAddItem.estado = false;
      this.calcular_total();
    },
    calcular_total() {
      let total = 0;

      for (const item of this.detalle) {
        total += parseFloat(item.valor);
      }

      this.form.total = total;
    },
    async grabar() {
      try {
        if (!this.detalle.length) toast("No hay detalles registrados");
        else {
          loader(true);
          let { send_data, detalle } = this.order_data();
          let dispatch = this.$store.dispatch;

          let nro = await dispatch("bills/save", { send_data, detalle });
          this.print(nro);
          loader(false);
        }
      } catch (error) {
        toast("Ocurrio un error guardando");
        loader(false);
      }
    },

    async print(nro) {
      let dispatch = this.$store.dispatch;
      let form = this.form;
      let data = `|${form.fecha.replaceAll("-", "")}|${
        form.agencie.codigo
      }|051|${nro}|`;

      let respose = await dispatch("bills/print", data);

      imprimir({
        data: respose.message[0],
        formato: "bills_pos",
        nit: this.info.company.id,
      }).then((base64) => {
        if (window.Capacitor) {
          window.plugins.PrintPDF.print({
            data: base64,
            type: "Data",
            title: "Impresion egreso",
            success: function () {
              console.log("success");
            },
            error: function (data) {
              data = JSON.parse(Data);
              console.log("failed" + data.error);
            },
          });
        }
      });
    },
    order_data() {
      let form = this.form;
      let fecha = form.fecha.replaceAll("-", "");

      let send_data = `|${form.consecutive}|${form.agencie.codigo}|${fecha}|${form.observaciones}|`;
      let detalle = {};

      this.detalle?.forEach((k, v) => {
        let index = v + 1;
        let name = `DATOJ-${String(index).padStart(3, "0")}`;

        let concepto = k.concepto.codigo_conc;
        let cliente = k.cliente.identificacion_rut;
        let factura = k.nro_fact;
        let valor = k.valor;

        detalle[name] = `${concepto}|${cliente}|${factura}|${valor}|`;
      });

      return { send_data, detalle };
    },
    openAddItem() {
      this.modalAddItem.estado = true;
    },
  },
};
</script>