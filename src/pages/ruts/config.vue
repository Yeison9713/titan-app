  <template>
  <f7-page class="main-titan no-swipe-panel">
    <f7-navbar theme-dark>
      <f7-nav-left>
        <f7-link :style="{ color: '#FFF' }" icon-f7="arrow_left" back></f7-link>
      </f7-nav-left>

      <f7-nav-title>
        <f7-icon size="22" f7="person_2" class="margin-right-half"></f7-icon>
        Configuración Ruts
      </f7-nav-title>
    </f7-navbar>

    <f7-card>
      <f7-card-content class="padding-half">
        <f7-row>
          <f7-col>
            <f7-list>
              <f7-list-item>
                <f7-button fill class="width-100" @click="create">
                  Agregar

                  <f7-icon
                    size="22"
                    f7="person_badge_plus"
                    class="margin-left-half"
                  ></f7-icon>
                </f7-button>
              </f7-list-item>
            </f7-list>
          </f7-col>
        </f7-row>
        <f7-row>
          <f7-col>
            <f7-list>
              <f7-list-item>
                <f7-button
                  fill
                  color="lightblue"
                  class="width-100"
                  @click="load_list"
                >
                  Lista ruts

                  <f7-icon
                    size="22"
                    f7="list_dash"
                    class="margin-left-half"
                  ></f7-icon>
                </f7-button>
              </f7-list-item>
            </f7-list>
          </f7-col>
        </f7-row>
      </f7-card-content>
    </f7-card>

    <lookup
      :estado="popup_lookup.estado"
      :params="popup_lookup.params"
      @closed="popup_lookup.estado = false"
      @callback="select_item"
    ></lookup>

    <crud
      :estado="popup_crud.estado"
      :params="popup_crud.params"
      :procedure="popup_crud.procedure"
      @closed="(popup_crud.estado = false), reload_customer()"
    ></crud>
  </f7-page>
</template>
  
<script>
import lookup from "../../components/user/lookup.vue";
import crud from "./popup_crud.vue";

export default {
  components: {
    lookup,
    crud,
  },
  data() {
    return {
      popup_crud: {
        estado: false,
        procedure: "",
        params: {},
      },

      popup_lookup: {
        estado: false,
        params: {},
      },
    };
  },

  created() {
    this.reload_customer();
  },

  methods: {
    load_list() {
      this.popup_lookup.estado = true;
      this.popup_lookup.params = {
        text: "Clientes",
        vuex: { getter: "customers/get_list" },
        columns: {
          value: ["identificacion_rut"],
          text: "descripcion_rut",
        },
      };
    },
    create() {
      this.popup_crud.params = {};
      this.popup_crud.procedure = "create";
      this.popup_crud.estado = true;
    },
    select_item(item) {
      this.popup_lookup.estado = false;
      this.popup_crud.params = item;
      this.popup_crud.procedure = "update";
      this.popup_crud.estado = true;
    },
    async reload_customer() {
      let dispatch = this.$store.dispatch;
      await dispatch("customers/query_list");
    },
  },
};
</script>
  
<style>
</style>