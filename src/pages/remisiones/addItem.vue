<template>
  <f7-popup v-model:opened="state" @popup:closed="closed">
    <f7-view>
      <f7-page>
        <f7-navbar title="Agregar producto o servicio">
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
                    label="Producto"
                    type="text"
                    outline
                    floating-label
                    disabled
                    :value="form.producto?.descripcion"
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
                    @click="modalItem.state = true"
                  >
                    <f7-icon f7="search" size="22"></f7-icon>
                  </f7-button>
                </f7-col>
              </f7-row>
            </f7-list-item-row>
            <f7-list-input
              label="Ubicación"
              type="select"
              floating-label
              outline
            >
              <option value="Male">1</option>
            </f7-list-input>
            <f7-list-input
              label="Presentación"
              type="select"
              floating-label
              outline
            >
              <option
                v-for="(item, index) in presentaciones"
                :value="item.value"
                :key="index"
              >
                {{ item.value }} - {{ item.label }}
              </option>
            </f7-list-input>
            <f7-list-item-row>
              <f7-row
                no-gap
                :style="{ width: '100%' }"
                class="display-flex justify-content-end"
              >
                <f7-col width="50">
                  <f7-list-input
                    label="Cantidad"
                    type="text"
                    outline
                    floating-label
                    v-model:value="form.cantidad"
                    @keyup="calcularTotal"
                  >
                  </f7-list-input>
                </f7-col>
                <f7-col width="50">
                  <f7-list-input
                    label="Valor unitario"
                    type="text"
                    outline
                    floating-label
                    v-model:value="form.valorUnitario"
                    @keyup="calcularTotal"
                  >
                  </f7-list-input>
                </f7-col>
              </f7-row>
            </f7-list-item-row>
            <f7-list-item-row>
              <f7-row
                no-gap
                :style="{ width: '100%' }"
                class="display-flex justify-content-end"
              >
                <f7-col width="60">
                  <f7-list-input
                    label="Total"
                    type="text"
                    outline
                    floating-label
                    disabled
                    :value="format_num(form.total)"
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
                  <f7-button fill color="green" class="margin" @click="addItem"
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
import lookup from "../../components/user/lookup.vue";
import { format_num } from "../../js/utils/plugins";
export default {
  props: {
    state: Boolean,
  },
  components: {
    lookup,
  },
  data() {
    return {
      form: {
        producto: null,
        valorUnitario: 0,
        cantidad: 0,
      },
      modalItem: {
        state: false,
        params: {
          text: "Productos",
          vuex: {
            getter: "products/get_list",
          },
          columns: {
            text: "descripcionpr_list",
            value: ["codigo_list", "codigopr_list"],
          },
        },
      },
    };
  },
  computed: {
    presentaciones() {
      return this.$store.getters["products/presentations"];
    },
  },
  methods: {
    format_num,
    closed() {
      this.$emit("closed");
    },
    selectItem(item) {
      if (item) {
        const { descripcionpr_list, baseproducto_list } = item;
        let label = atob(descripcionpr_list);
        item.descripcion = label;

        let valorUnitario =
          parseFloat(baseproducto_list.replace(/\,/g, "")) || 0;

        this.form.producto = item;
        this.form.valorUnitario = valorUnitario;

        this.modalItem.state = false;
      }
    },
    calcularTotal() {
      const { cantidad, valorUnitario } = this.form;
      const valorCantidad = parseFloat(cantidad) || 0;
      const unitario = parseFloat(valorUnitario) || 0;

      const total = unitario * valorCantidad;
      this.form.total = parseFloat(total.toFixed(0));
    },
    addItem() {
      this.$emit("callback", this.form);
    },
  },
};
</script>