<template>
  <f7-page class="main-titan no-swipe-panel">
    <f7-navbar theme-dark>
      <f7-nav-left>
        <f7-link :style="{ color: '#FFF' }" icon-f7="arrow_left" back></f7-link>
      </f7-nav-left>

      <f7-nav-title>
        <f7-icon size="22" f7="briefcase" class="margin-right-half"></f7-icon>
        Reporte saldo inventarios
      </f7-nav-title>
    </f7-navbar>
    <f7-card
      :style="{
        padding: '10px',
      }"
    >
      <f7-list>
        <f7-list-input
          label="Fecha corte"
          type="date"
          outline
          floating-label
          v-model:value="form.fecha_corte"
        >
        </f7-list-input>

        <f7-list-input
          label="Ubicacion a procesar"
          type="select"
          v-model:value="form.select_location"
        >
          <option value="0" selected>Todas las ubicaciones</option>
          <option value="1">Selecione una</option>
        </f7-list-input>

        <f7-list-item
          title="Selecione una ubicacion"
          smart-select
          :smart-select-params="{
            closeOnSelect: true,
            setValueText: false,
          }"
          :after="
            textValue('locations', form.location, 'codigo_ubic', 'descrip_ubic')
          "
          v-if="form.select_location == 1"
        >
          <select name="locations" v-model="form.location">
            <option
              v-for="item in locations"
              :key="item.codigo_ubic"
              :value="item.codigo_ubic"
            >
              {{ capitalize(item.descrip_ubic) }}
            </option>
          </select>
        </f7-list-item>

        <f7-list-input
          label="Producto a procesar"
          type="select"
          v-model:value="form.select_product"
        >
          <option value="0" selected>Todos los productos</option>
          <option value="1">Selecione uno</option>
        </f7-list-input>

        <f7-list-item
          title="Selecione un producto"
          smart-select
          :smart-select-params="{
            closeOnSelect: true,
            setValueText: false,
          }"
          :after="
            textValue('products', form.product, 'codigo_pr', 'descripcion_pr')
          "
          v-if="form.select_product == 1"
        >
          <select name="products" v-model="form.product">
            <option
              v-for="item in products"
              :key="item.codigo_pr"
              :value="item.codigo_pr"
            >
              {{ capitalize(item.descripcion_pr) }}
            </option>
          </select>
        </f7-list-item>
        <f7-list-item>
          <f7-button color="" class="width-100" large outline @click="consultar"
            >Consultar</f7-button
          >
        </f7-list-item>
      </f7-list>
    </f7-card>
    <saldoInventarios
      :estado="popup.estado"
      :data="popup.data"
    ></saldoInventarios>
  </f7-page>
</template>

<script>
import { mapGetters } from "vuex";
import { current_date } from "../../js/utils/global";
import { loader, toast } from "../../js/utils/plugins";
import saldoInventarios from "../../components/user/reportes/saldoInventarios.vue";
export default {
  components: {
    saldoInventarios,
  },
  data() {
    return {
      form: {
        fecha_corte: current_date().split("/").reverse().join("-"),
        select_location: "1",
        location: null,
        select_product: "0",
        product: null,
      },
      popup: {
        estado: false,
        data: [],
      },
    };
  },
  created() {
    this.init_form();
  },
  computed: {
    ...mapGetters({
      locations: "locations/get_list",
      products: "products/get_list2",
      info_user: "user/get_data_config",
    }),
  },
  methods: {
    async init_form() {
      try {
        loader(true);
        let dispatch = this.$store.dispatch;
        this.form.location = this.info_user.ubicacion.codigo;

        await dispatch("user/query_data_config");
        await dispatch("setting/query_data");
        await dispatch("locations/query_list");
        await dispatch("products/query_list2");

        loader(false);
      } catch (error) {
        loader(false);
        toast("Error cargando informacion");
      }
    },
    async consultar() {
      let { fecha_corte, select_location, location, select_product, product } =
        this.form;

      if (select_location == "1" && !location) {
        toast("Debe selecionar una ubicació");
      } else if (select_product == "1" && !product) {
        toast("Debe selecionar un producto");
      } else {
        loader(true);
        let dispatch = this.$store.dispatch;

        location = select_location == "0" ? select_location : location;
        product = select_product == "0" ? select_product : product;

        let send_data =
          location + "|" + product + "|" + fecha_corte.replaceAll("-", "");

        const response = await dispatch("products/see_portfolio", send_data);

        for (const item of response.message) {
          item.base1_pr = atob(item.base1_pr || "");
          item.descripprod_rep = atob(item.descripprod_rep || "");
        }

        loader(false);

        this.popup.estado = true;
        this.popup.data = response.message.filter((e) => e.ubicacion_rep);
      }
    },
    capitalize(str = "") {
      const array = str.toLowerCase().split(" ");

      for (var i = 0; i < array.length; i++) {
        array[i] = array[i].charAt(0).toUpperCase() + array[i].slice(1);
      }

      return array.join(" ");
    },
    textValue(obj, id, field = "value", resolve = "text") {
      let retornar = this[obj]?.find((e) => e[field] == id);

      if (!retornar || retornar?.text) return retornar?.text || "";
      else return retornar[resolve] || "";
    },
  },
};
</script>