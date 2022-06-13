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
            <f7-col width="60">
              <f7-list-input
                label="Punto de entrega"
                type="select"
                floating-label
                outline
                v-model:value="form.agencia"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </f7-list-input>
            </f7-col>
            <f7-col width="40">
              <f7-list-input
                label="Consecutivo"
                type="text"
                outline
                floating-label
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
                      icon-f7="multiply"
                      icon-color="white"
                      icon-size="24"
                      class="swipeout-red"
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
                        <b>Ubicación:</b>
                        PRODUCTOS RUTA 1
                      </f7-col>
                    </f7-row>
                  </div>
                </div>
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
                <option value="0">Contado</option>
                <option value="1">Credito</option>
                <option value="2">Anticipado</option>
              </f7-list-input>
            </f7-col>
            <f7-col width="50">
              <f7-list-input
                label="Medio de pago"
                type="select"
                floating-label
                outline
                v-model:value="form.medioPago"
              >
                <option value="0">Efectivo</option>
                <option value="1">Tarjeta debito</option>
                <option value="2">Tarjeta de credito</option>
                <option value="3">Transferencia</option>
                <option value="4">Anticipado</option>
                <option value="5">Bono</option>
              </f7-list-input>
            </f7-col>
          </f7-row>
        </f7-list-item-row>
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
              <f7-button fill color="green">subir </f7-button>
            </f7-col>
            <f7-col>
              <f7-button fill color="gray">imprimir </f7-button>
            </f7-col>
            <f7-col>
              <f7-button fill color="orange">compartir </f7-button>
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

    <addItem :state="modalAddItem.state" @closed="modalAddItem.state = false" @callback="addItemDetail"/>
  </f7-page>
</template>
<script>
import lookup from "../../components/user/lookup.vue";
import addItem from "./addItem.vue";
import { format_num } from "../../js/utils/plugins";

export default {
  components: {
    lookup,
    addItem,
  },
  data() {
    return {
      form: {
        cliente: null,
        consecutivo: null,
        agencia: null,
        fecha: null,
        formaPago: null,
        medioPago: null,
        observaciones: null,
      },
      detalle: [],
      searchState: false,
      searchParams: {},
      modalAddItem: {
        state: false,
      },
    };
  },
  async created() {
    await this.$store.dispatch("customers/query_list");
    await this.$store.dispatch("products/query_list");
  },
  methods: {
    format_num,
    addItemDetail(item){
      console.log('item', item)
      this.detalle.push(item)
      this.modalAddItem.state = false
    },
    openAddItem() {
      this.modalAddItem.state = true;
    },
    openClients() {
      this.searchParams = this.mapClient();
      this.searchState = true;
    },
    selectClient(item) {
      this.form.cliente = item;
      this.searchState = false;
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