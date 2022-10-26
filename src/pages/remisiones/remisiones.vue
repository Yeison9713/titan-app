<template>
  <f7-page>
    <f7-navbar
      title="Remisión de Mercancías para Facturar"
      back-link="Back"
    ></f7-navbar>
    <f7-card
      :style="{
        padding: '10px',
      }"
    >
      <f7-list form class="form_factura">
        <f7-list-item-row>
          <f7-row no-gap>
            <f7-col width="65">
              <f7-list-input
                label="Punto de entrega"
                type="text"
                floating-label
                outline
                :disabled="true"
                v-model:value="form.descrip_agencia"
              >
              </f7-list-input>
            </f7-col>
            <f7-col width="35">
              <f7-list-input
                label="Consecutivo"
                type="text"
                outline
                floating-label
                :disabled="true"
                v-model:value="form.consecutivo"
              />
            </f7-col>
          </f7-row>
        </f7-list-item-row>
        <f7-list-item-row no-gap>
          <f7-row
            no-gap
            :style="{ width: '100%' }"
            class="display-flex justify-content-end"
          >
            <f7-col width="60">
              <f7-list-input
                label="Fecha"
                type="date"
                outline
                floating-label
                v-model:value="form.fecha"
                :disabled="true"
              />
            </f7-col>
          </f7-row>
        </f7-list-item-row>
        <f7-list-item-row>
          <f7-row no-gap :style="{ width: '100%' }">
            <f7-col width="80">
              <f7-list-input
                label="Cliente"
                type="text"
                outline
                floating-label
                :value="form.cliente?.descripcion_rut"
                disabled
              />
            </f7-col>
            <f7-col
              width="20"
              :style="{ height: '100%' }"
              class="display-flex align-items-center padding-right"
            >
              <f7-button
                fill
                color="green"
                :style="{ width: '100%', 'margin-top': '8px' }"
                @click="openClients"
              >
                <f7-icon f7="search" size="22"></f7-icon>
              </f7-button>
            </f7-col>
          </f7-row>
        </f7-list-item-row>
        <f7-list-item title="Detalle" group-title />
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
            Agregar producto/servicio
          </f7-button>
        </f7-list-item-row>

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
                          <b>{{ item.producto?.descripcion }}</b>
                        </div>
                      </f7-col>
                      <f7-col
                        width="30"
                        class="text-align-right"
                        :style="{ 'font-size': '12px' }"
                      >
                        $ {{ format_num(item.total) }}
                      </f7-col>
                    </f7-row>
                  </div>

                  <div class="swipeout-actions-right">
                    <f7-link
                      icon-f7="pencil"
                      icon-color="white"
                      icon-size="24"
                      class="swipeout-red"
                      color="green"
                      @click="change_item(index, item)"
                    ></f7-link>
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
                        <b>Cantidad:</b>
                        {{ format_num(item.cantidad) }}
                      </f7-col>

                      <f7-col width="100">
                        <b>V. Unitario:</b>
                        {{ item.producto?.baseproducto_list }}
                      </f7-col>

                      <f7-col width="100">
                        <b>Presentacion:</b>
                        {{ item.presentacion }}
                      </f7-col>
                    </f7-row>
                  </div>
                </div>
              </li>

              <li v-if="form.total_rem > 0">
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
                        $ {{ format_num(form.total_rem) }}
                      </f7-col>
                    </f7-row>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </f7-list-item>

        <f7-list-item title="Cierre de remisión" group-title />

        <!-- cajitas.............................................. -->

        <f7-list-item-row>
          <f7-row no-gap :style="{ width: '100%' }">
            <f7-col width="50">
              <f7-list-input
                label="Forma de pago"
                type="select"
                floating-label
                outline
                v-model:value="form.formaPago"
              >
                <option
                  v-for="item in formaPago"
                  :key="item"
                  :value="item.value"
                >
                  {{ item.text }}
                </option>
              </f7-list-input>
            </f7-col>
            <f7-col width="50" v-if="form.formaPago != '2'">
              <f7-list-input
                label="Medio de pago"
                type="select"
                floating-label
                outline
                v-model:value="form.medioPago"
              >
                <option
                  v-for="item in medioPago"
                  :key="item"
                  :value="item.value"
                >
                  {{ item.text }}
                </option>
              </f7-list-input>
            </f7-col>

            <f7-col width="50" v-if="form.formaPago == '2'">
              <f7-list-input
                label="Días plazo"
                type="text"
                floating-label
                outline
                v-model:value="form.diasPlazo"
              ></f7-list-input>
            </f7-col>
          </f7-row>
        </f7-list-item-row>

        <f7-list-item-row>
          <f7-row no-gap :style="{ width: '100%' }">
            <f7-col>
              <f7-list-input
                label="Valor efectivo"
                type="text"
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
                type="text"
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

    <lookup
      :estado="searchState"
      :params="searchParams"
      @callback="selectClient"
      @closed="searchState = false"
    />

    <addItem
      :state="modalAddItem.state"
      :change="modalAddItem.change"
      @closed="(modalAddItem.state = false), (modalAddItem.change = {})"
      @callback="addItemDetail"
    />
  </f7-page>
</template>
<script>
import lookup from "../../components/user/lookup.vue";
import addItem from "./addItem.vue";

import { format_num, loader, toast } from "../../js/utils/plugins";
import {
  formaPago,
  medioPago,
  textValue,
  current_date,
} from "../../js/utils/global";

import { mapGetters, mapActions } from "vuex";
import _ from "lodash";

import { imprimir } from "../../js/utils/print";

export default {
  components: {
    lookup,
    addItem,
  },
  data() {
    return {
      formaPago,
      medioPago,
      form: {},
      detalle: [],
      searchState: false,
      searchParams: {},
      modalAddItem: {
        state: false,
        change: {},
      },
    };
  },

  created() {
    this.init_form();
  },

  computed: {
    ...mapGetters({
      // config_user: "user/get_data_config",
      consecutive: "remisiones/get_consecutive",
      info_user: "middleware/get_info",
      products: "products/get_list",
      presentations: "presentations/get_list",
      customers: "customers/get_list",
    }),
  },

  watch: {
    consecutive: function (val) {
      this.form.agencia = val?.agencia?.codigo;
      this.form.descrip_agencia = `${val?.agencia?.codigo} - ${val?.agencia?.nombre}`;
      this.form.consecutivo = val.agencia.consecutivo;
    },
  },
  methods: {
    textValue,
    format_num,
    ...mapActions({
      save_remision: "remisiones/save",
    }),

    async init_form() {
      this.detalle = [];
      loader(true);
      this.form = {
        cliente: null,
        consecutivo: null,
        agencia: null,
        descrip_agencia: null,
        fecha: current_date().split("/").reverse().join("-"),
        formaPago: 1,
        diasPlazo: 0,
        medioPago: 10,
        efectivo: null,
        transferencia: null,
        bancoTransferencia: null,
        observaciones: null,
        total_rem: 0,
      };

      let dispatch = this.$store.dispatch;

      await dispatch("user/query_data_config");
      await dispatch("setting/query_data");
      await dispatch("agencies/download");
      await dispatch("remisiones/validate_consecutive");
      await dispatch("customers/query_list");
      await dispatch("products/query_list");
      await dispatch("presentations/query_list");
      loader(false);
    },

    addItemDetail(item, index) {
      if (index >= 0) this.detalle[index] = _.cloneDeep(item);
      else this.detalle.push(item);

      this.modalAddItem.state = false;
      this.put_total();
    },
    put_total() {
      this.form.total_rem = 0;

      this.detalle.forEach((e) => {
        this.form.total_rem += parseFloat(e.total);
      });
    },
    openAddItem() {
      this.modalAddItem.state = true;
    },
    change_item(index, item) {
      this.modalAddItem.change = _.cloneDeep({ index, ...item });
      this.modalAddItem.state = true;
    },
    delete_item(index) {
      this.detalle.splice(index, 1);
    },
    openClients() {
      this.searchParams = this.mapClient();
      this.searchState = true;
    },
    selectClient(item) {
      this.form.cliente = item;
      this.searchState = false;
    },

    async grabar() {
      try {
        let { form, detalle } = this;

        if (!form.cliente) toast("Debe selecionar un cliente");
        else if (_.isEmpty(detalle)) toast("No se han agregado registros");
        else if (!form.formaPago) toast("Selecione la forma de pago");
        else if (form.formaPago != 2 && !form.medioPago)
          toast("Selecione un medio de pago");
        else if (!form.efectivo && !form.transferencia)
          toast("Ingrese un valor de efectivo o transferencia");
        else if (!form.bancoTransferencia) toast("Selecione un banco");
        else {
          let loader_src = loader(true);
          loader_src.setTitle(`Guardando remisión...`);

          // save remision
          let datos = {
            ...form,
            detalle,
          };

          const response = await this.save_remision(_.cloneDeep(datos));
          await this.imprimir_remisiones(response.message);

          this.init_form();
          loader(false);
          toast("Proceso terminado correctamente");
        }
      } catch (error) {
        loader(false);
        toast("Ha ocurrido guardando la remision");
        console.error("Error", error);
      }
    },

    imprimir_remisiones(data) {
      return new Promise(async (resolve, reject) => {
        try {
          let datos = {
            ...data,
            // descrip_forma_pago: this.textValue("formaPago", data.formaPago),
            elaboro: {
              fecha: new Date().getTime(),
              operador: this.info_user.user,
            },
          };

          imprimir({ data: _.cloneDeep(datos), formato: "remision_pos" })
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

              resolve();
            })
            .catch((error) => {
              console.log(error);
              reject();
            });
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    },

    mapClient() {
      return {
        text: "Clientes",
        vuex: {
          getter: "customers/get_list",
        },
        columns: {
          text: "descripcion_rut",
          value: ["identificacion_rut"],
        },
      };
    },
  },
};
</script>