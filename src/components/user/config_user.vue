<template>
  <f7-popup
    class="config_user"
    v-model:opened="estado"
    @popup:open="open"
    @popup:closed="close"
  >
    <f7-page>
      <f7-navbar title="Configuracion usuario">
        <f7-nav-right>
          <f7-link popup-close>
            <f7-link icon-f7="xmark" size="22"></f7-link>
          </f7-link>
        </f7-nav-right>
        <f7-nav-left> </f7-nav-left>
      </f7-navbar>

      <f7-card>
        <f7-list>
          <f7-list-input
            label="Prefijo"
            type="text"
            error-message="Campo obligatorio"
            required
            clear-button
            v-model:value="form.prefijo"
            :error-message-force="errores.prefijo"
            @input="errores.prefijo = false"
          ></f7-list-input>

          <f7-list-input
            label="Numero prefijo"
            type="number"
            error-message="Campo obligatorio"
            required
            clear-button
            v-model:value="form.numero"
            :error-message-force="errores.numero"
            @input="errores.numero = false"
          ></f7-list-input>

          <f7-list-input
            label="Codigo ubicacion"
            type="text"
            error-message="Campo obligatorio"
            required
            clear-button
            v-model:value="form.ubicacion"
            :error-message-force="errores.ubicacion"
            @input="errores.ubicacion = false"
          ></f7-list-input>

          <f7-list-input
            label="Agencia"
            type="text"
            error-message="Campo obligatorio"
            required
            clear-button
            v-model:value="form.agencia"
            :error-message-force="errores.agencia"
            @input="errores.agencia = false"
          ></f7-list-input>

          <f7-list-item class="">
            <f7-button
              color="teal"
              class="width-100"
              large
              outline
              @click="validate_form"
              >Guardar</f7-button
            >
          </f7-list-item>
        </f7-list>
      </f7-card>
    </f7-page>
  </f7-popup>
</template>

<script>
import { mapGetters } from "vuex";
import { loader, toast } from "../../js/utils/plugins";
export default {
  props: {
    estado: Boolean,
  },
  data() {
    return {
      form: {
        prefijo: null,
        numero: null,
        ubicacion: null,
        agencia: null,
      },
      errores: {
        prefijo: false,
        numero: false,
        ubicacion: false,
        agencia: false,
      },
    };
  },
  computed: {
    ...mapGetters({ data_config: "user/get_data_config" }),
  },
  watch: {
    data_config: function (val) {
      this.form = { ...val };
    },
  },

  methods: {
    async open() {
      await this.$store.dispatch("user/query_data_config");
    },
    close() {
      this.$emit("closed", false);
    },
    async validate_form() {
      let { form, errores } = this;

      if (!form.prefijo) errores.prefijo = true;
      else if (!form.numero) errores.numero = true;
      else if (!form.ubicacion) errores.ubicacion = true;
      else if (!form.agencia) errores.agencia = true;
      else {
        let dispatch = this.$store.dispatch;

        try {
          let loader_src = loader(true);
          loader_src.setTitle(`Guardando configuracion...`);

          await dispatch("user/save_config", [{ ...form }]);

          loader(false);
          toast("Proceso terminado correctamente");
        } catch (error) {
          loader(false);
          toast("Ocurrio un error guardando la informacion ");
          console.error(error);
        }
      }
    },
  },
};
</script>