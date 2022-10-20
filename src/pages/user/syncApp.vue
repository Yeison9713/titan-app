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
              @click="validate_popup(item)"
            ></f7-list-item>
          </f7-list>
        </f7-row>
      </f7-card-content>
    </f7-card>

    <configUser
      :estado="popup_config.estado"
      @closed="popup_config.estado = false"
    ></configUser>

    <lookup
      :estado="popup_lookup.estado"
      :params="popup_lookup.params"
      @closed="popup_lookup.estado = false"
    ></lookup>
  </f7-page>
</template>

<script>
import { f7 } from "framework7-vue";
import { store } from "../../js/store/index";
import { format_num, loader, toast } from "../../js/utils/plugins";
import { mapGetters } from "vuex";

import configUser from "../../components/user/config_user.vue";
import lookup from "../../components/user/lookup.vue";

export default {
  components: {
    configUser,
    lookup,
  },

  data() {
    return {
      popup_config: {
        estado: false,
      },

      popup_lookup: {
        estado: false,
        params: {},
      },

      menu_data: [
        {
          id: "user",
          text: "Usuario",
          footer: "Falta configurar datos del usuario",
          popup: "popup_config",
        },

        {
          id: "setting",
          text: "Configuracion",
          footer: "Falta sincronizar dispositivo",
        },
        {
          id: "products",
          text: "Productos",
          footer: null,

          // data popup
          popup: "popup_lookup",
          getter: "products/get_list",
          columns: {
            value: ["codigo_list", "codigopr_list"],
            text: "descripcionpr_list",
          },
        },
        {
          id: "presentations",
          text: "Presentaciones",
          footer: null,

          // data popup
          popup: "popup_lookup",
          getter: "presentations/get_list",
          columns: {
            value: ["codigo_rep"],
            text: "descripcion_rep",
          },
        },
        {
          id: "customers",
          text: "Clientes",
          footer: null,
          // data popup
          popup: "popup_lookup",
          getter: "customers/get_list",
          columns: {
            value: ["identificacion_rut"],
            text: "descripcion_rut",
          },
        },
        {
          id: "cities",
          text: "Ciudades",
          footer: null,
          // data popup
          popup: "popup_lookup",
          getter: "cities/get_list",
          columns: {
            value: ["c_digo_dane_del_municipio"],
            text: "municipio",
          },
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      config_user: "user/get_data_config",
      setting: "setting/get_data",
      products: "products/get_list",
      presentations: "presentations/get_list",
      customers: "customers/get_list",
      cities: "cities/get_list",
    }),
  },

  watch: {
    config_user: function (val) {
      let info = { ...val };

      if (info.prefijo) {
        let data = `Prefijo ${info.prefijo} - Numero ${info.numero}`;
        this.text_footer("user", data);
      }
    },
    setting: function (val) {
      let info = { ...val };

      if (info.descrip_empr) {
        let data = `${format_num(info.id_empr)} - ${info.descrip_empr}`;
        this.text_footer("setting", data);
      }
    },
    products: function (val) {
      this.text_footer("products", `${val.length} Registros`);
    },
    presentations: function (val) {
      this.text_footer("presentations", `${val.length} Registros`);
    },
    customers: function (val) {
      this.text_footer("customers", `${val.length} Registros`);
    },
    cities: function (val) {
      this.text_footer("cities", `${val.length} Registros`);
    },
  },

  async created() {
    let dispatch = this.$store.dispatch;

    await dispatch("user/query_data_config");
    await dispatch("setting/query_data");
    await dispatch("products/query_list");
    await dispatch("presentations/query_list");
    await dispatch("customers/query_list");
    await dispatch("cities/query_list");
  },

  methods: {
    validate_popup(item) {
      if (item.popup) {
        //
        this[item.popup].estado = true;

        this[item.popup].params = {
          text: item.text,
          vuex: {
            getter: item.getter,
          },
          columns: item.columns,
        };

        //
      } else toast("No se puede ver informacion");
    },

    async download_data() {
      try {
        let loader_src = loader(true);

        loader_src.setTitle(`Descargando configuracion...`);
        await store.dispatch("setting/download", { online: false });

        loader_src.setTitle(`Descargando productos...`);
        await store.dispatch("products/download", { online: false });

        loader_src.setTitle(`Descargando presentaciones...`);
        await store.dispatch("presentations/download", { online: false });

        loader_src.setTitle(`Descargando clientes...`);
        await store.dispatch("customers/download", { online: false });

        loader_src.setTitle(`Descargando ciudades...`);
        await store.dispatch("cities/download", { online: false });

        loader(false);
        toast("Proceso terminado correctamente");
        setTimeout(() => {
          location.reload();
        }, 500);
      } catch (err) {
        loader(false);
        toast(
          "Ha ocurrido un error procesando la información. <br> Verifica la configuración e intenta más tarde."
        );
        console.error("Error", err);
      }
    },

    text_footer(id, text) {
      let index = this.menu_data.findIndex((e) => e.id == id);

      if (index >= 0) {
        this.menu_data[index].footer = text;
      }
    },
  },
};
</script>