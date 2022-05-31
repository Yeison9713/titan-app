<template>
  <f7-page class="main-titan no-swipe-panel">
    <f7-navbar theme-dark>
      <f7-nav-left>
        <f7-link :style="{ color: '#FFF' }" icon-f7="arrow_left" back></f7-link>
      </f7-nav-left>

      <f7-nav-title>
        <f7-icon
          size="22"
          f7="cloud_download"
          class="margin-right-half"
        ></f7-icon>
        Sincronizar mobile
      </f7-nav-title>
    </f7-navbar>

    <f7-card>
      <f7-card-content class="padding-half">
        <f7-row>
          <f7-col>
            <f7-list>
              <f7-list-item>
                <f7-button
                  fill
                  color="teal"
                  class="width-100"
                  @click="download_data"
                >
                  Consultar datos

                  <f7-icon
                    class="margin-left-half"
                    f7="arrow_down_circle"
                    size="22"
                    @click="download_data"
                  ></f7-icon>
                </f7-button>
              </f7-list-item>
            </f7-list>
          </f7-col>
        </f7-row>
      </f7-card-content>
    </f7-card>

    <f7-card>
      <f7-card-content class="padding-half">
        <f7-row>
          <f7-list class="width-100" media-list>
            <f7-list-item
              v-for="item in menu_data"
              :key="item"
              :title="item.text"
              link="#"
              :footer="item.footer"
            ></f7-list-item>
          </f7-list>
        </f7-row>
      </f7-card-content>
    </f7-card>
  </f7-page>
</template>

<script>
import { store } from "../../js/store/index";
import { format_num, loader, toast } from "../../js/utils/plugins";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      menu_data: [
        {
          id: "user",
          text: "Usuario",
          footer: "Falta configurar datos del usuario",
        },

        {
          id: "setting",
          text: "Configuracion",
          footer: "Falta sincronizar dispositivo",
        },
        { id: "products", text: "Productos", footer: null },
        { id: "customers", text: "Clientes", footer: null },
      ],
    };
  },

  computed: {
    ...mapGetters({
      setting: "setting/get_data",
      products: "products/get_list",
      customers: "customers/get_list",
    }),
  },

  watch: {
    setting: function (val) {
      let info = { ...val[0] };

      if (info.descrip_empr) {
        let data = `${format_num(info.id_empr)} - ${info.descrip_empr}`;
        this.text_footer("setting", data);
      }
    },
    products: function (val) {
      this.text_footer("products", `${val.length} Registros`);
    },
    customers: function (val) {
      this.text_footer("customers", `${val.length} Registros`);
    },
  },

  async created() {
    let dispatch = this.$store.dispatch;

    await dispatch("setting/load_data");
    await dispatch("products/load_list");
    await dispatch("customers/load_list");
  },

  methods: {
    async download_data() {
      try {
        let loader_src = loader(true);

        loader_src.setTitle(`Descargando configuracion...`);
        await store.dispatch("setting/download");

        loader_src.setTitle(`Descargando productos...`);
        await store.dispatch("products/download");

        loader_src.setTitle(`Descargando clientes...`);
        await store.dispatch("customers/download");

        loader(false);
        toast("Proceso terminado correctamente");
      } catch (error) {
        loader(false);
        toast(
          "Ha ocurrido un error procesando la información. <br> Verifica la configuración e intenta más tarde."
        );
        console.error("Error", err);
      }
    },

    text_footer(id, text) {
      let index = this.menu_data.findIndex((e) => e.id == id);

      if (index > 0) {
        this.menu_data[index].footer = text;
      }
    },
  },
};
</script>