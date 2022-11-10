<template>
  <f7-popup v-model:opened="estado" @popup:closed="closed" @popup:opened="open">
    <f7-view>
      <f7-page>
        <f7-navbar title="Agregar detalle">
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>
        </f7-navbar>
        <f7-card>
          <f7-list form>
            <f7-list-item-row>
              <f7-row no-gap :style="{ width: '100%' }">
                <f7-col width="80">
                  <f7-list-input
                    label="Concepto"
                    type="text"
                    outline
                    floating-label
                    disabled
                    :value="form.concepto?.descrip_conc"
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
                    :style="{ width: '100%', 'margin-top': '7px' }"
                    @click="openLoolUp('concepts')"
                  >
                    <f7-icon f7="search" size="22"></f7-icon>
                  </f7-button>
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
                    disabled
                    :value="form.cliente?.descripcion_rut"
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
                    :style="{ width: '100%', 'margin-top': '7px' }"
                    @click="openLoolUp('customers')"
                  >
                    <f7-icon f7="search" size="22"></f7-icon>
                  </f7-button>
                </f7-col>
              </f7-row>
            </f7-list-item-row>

            <f7-list-item-row>
              <f7-row
                no-gap
                :style="{ width: '100%' }"
                class="display-flex justify-content-end"
              >
                <f7-col width="50">
                  <f7-list-input
                    label="Nro. Factura"
                    type="text"
                    outline
                    floating-label
                    v-model:value="form.nro_fact"
                  >
                  </f7-list-input>
                </f7-col>
                <f7-col width="50">
                  <f7-list-input
                    label="Valor pagado"
                    type="number"
                    outline
                    floating-label
                    v-model:value="form.valor"
                    @keyup="calcularTotal"
                  >
                  </f7-list-input>
                </f7-col>
              </f7-row>
            </f7-list-item-row>

            <f7-list-item-row>
              <f7-row no-gap :style="{ width: '100%' }">
                <f7-col>
                  <f7-button color="red" class="margin" outline @click="closed"
                    >Cerrar</f7-button
                  >
                </f7-col>
                <f7-col>
                  <f7-button fill color="green" class="margin" @click="grabar"
                    >Agregar</f7-button
                  >
                </f7-col>
              </f7-row>
            </f7-list-item-row>
          </f7-list>
        </f7-card>
      </f7-page>
    </f7-view>

    <lookup
      :estado="modalItem.state"
      :params="modalItem.params"
      @callback="selectItem"
      @closed="modalItem.state = false"
    />
  </f7-popup>
</template>

<script>
import { f7 } from "framework7-vue";
import lookup from "../../components/user/lookup.vue";
import { toast } from "../../js/utils/plugins";

export default {
  props: {
    estado: false,
    params: {
      data: {},
    },
  },

  components: {
    lookup,
  },

  data() {
    return {
      modalItem: {
        state: false,
        current: null,
        params: {},
      },
      form: {
        concepto: {},
        cliente: {},
        nro_fact: null,
        valor: null,
      },
      sheet: null,
    };
  },

  watch: {
    estado: function (val) {
      this.form = {
        concepto: {},
        cliente: {},
        nro_fact: null,
        valor: null,
      };
    },
  },

  methods: {
    closed() {
      this.$emit("closed");
    },
    openLoolUp(table) {
      this.modalItem.current = table;
      this.modalItem.params = this.params_look_up(table);
      this.modalItem.state = true;
    },
    selectItem(item) {
      if (this.modalItem.current == "customers") {
        this.form.cliente = item;
      } else if (this.modalItem.current == "concepts") {
        this.form.concepto = item;
      }

      this.modalItem.state = false;
    },
    grabar() {
      let form = this.form;
      if (!form.concepto.codigo_conc) toast("Selecione un concepto");
      else if (!form.cliente.identificacion_rut) toast("Selecione un cliente");
      else if (!form.nro_fact) toast("Ingrese un número de factura");
      else if (!form.valor) toast("Ingrese un valor");
      else {
        this.$emit("callback", this.form);
      }
    },

    params_look_up(table) {
      const data = {
        customers: {
          text: "Clientes",
          vuex: {
            getter: "customers/get_list",
          },
          columns: {
            text: "descripcion_rut",
            value: ["identificacion_rut"],
          },
        },
        concepts: {
          text: "Conceptos",
          vuex: {
            getter: "concepts/get_list",
          },
          columns: {
            text: "descrip_conc",
            value: ["codigo_conc"],
          },
        },
      };

      return data[table];
    },
  },
};
</script>