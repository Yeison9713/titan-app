<template>
  <f7-page>
    <f7-navbar title="Reimpresion de remisiones" back-link="Back"></f7-navbar>
    <f7-card
      :style="{
        padding: '10px',
      }"
    >
      <f7-list form class="reimpresion_remision">
        <f7-list-item title="Listado de remisiones" group-title />

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
                      <f7-col width="80">
                        <div
                          class="item-title"
                          :style="{ 'font-size': '12px' }"
                        >
                          <b>{{ item.cliente?.descripcion_rut }}</b>
                        </div>
                      </f7-col>
                      <f7-col
                        width="20"
                        class="text-align-right"
                        :style="{ 'font-size': '12px' }"
                      >
                        Fact. {{ format_num(item.consecutivo) }}
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
                        <b>Fecha:</b>
                        {{ item.fecha }}
                      </f7-col>

                      <f7-col width="100">
                        <b>Forma de pago:</b>
                        {{ textValue("formaPago", item.formaPago) }}
                      </f7-col>

                      <f7-col width="100">
                        <b>Medio de pago:</b>
                        {{ textValue("medioPago", item.medioPago) }}
                      </f7-col>

                      <f7-col width="100">
                        <b>Observaciones:</b>
                        {{ item.observaciones }}
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
</template>

<script>
import { format_num } from "../../js/utils/plugins";
import { formaPago, medioPago, textValue } from "../../js/utils/global";

import { imprimir } from "../../js/utils/print";
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
  data() {
    return {
      formaPago,
      medioPago,
    };
  },
  async created() {
    let dispatch = this.$store.dispatch;

    await dispatch("remisiones/query_list");
    await dispatch("setting/query_data");
  },
  computed: {
    ...mapGetters({
      detalle: "remisiones/get_list",
      info_user: "user/get_info",
    }),
  },
  methods: {
    format_num,
    textValue,
    print_pdf(item) {
      let datos = {
        ...item,
        descrip_forma_pago: this.textValue("formaPago", item.formaPago),
      };

      try {
        imprimir({ data: _.cloneDeep(datos), formato: "remision_pos" })
          .then((res) => {
            console.log(res);
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