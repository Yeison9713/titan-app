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
          <f7-link popup-close icon-f7="xmark" size="22"></f7-link>
        </f7-nav-right>
      </f7-navbar>

      <f7-card
        :style="{
          padding: '10px',
        }"
      >
        <f7-list>
          <f7-list-item>
            <span>Online</span>
            <f7-toggle
              v-model:checked="form.state_network"
              :disabled="true"
            ></f7-toggle>
          </f7-list-item>

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

          <f7-list-item title="Datos ubicación" group-title />

          <f7-list-input
            label="Codigo "
            type="number"
            error-message="Campo obligatorio"
            required
            clear-button
            v-model:value="form.ubicacion.codigo"
            :error-message-force="errores.ubicacion.codigo"
            @input="errores.ubicacion.codigo = false"
          ></f7-list-input>

          <f7-list-input
            label="Descripcion "
            type="text"
            error-message="Campo obligatorio"
            required
            clear-button
            v-model:value="form.ubicacion.nombre"
            :error-message-force="errores.ubicacion.nombre"
            @input="errores.ubicacion.nombre = false"
          ></f7-list-input>

          <f7-list-item title="Datos agencia" group-title />

          <f7-list-input
            label="Codigo"
            type="number"
            error-message="Campo obligatorio"
            required
            clear-button
            v-model:value="form.agencia.codigo"
            :error-message-force="errores.agencia.codigo"
            @input="errores.agencia.codigo = false"
          ></f7-list-input>

          <f7-list-input
            label="Descripcion"
            type="text"
            error-message="Campo obligatorio"
            required
            clear-button
            v-model:value="form.agencia.nombre"
            :error-message-force="errores.agencia.nombre"
            @input="errores.agencia.nombre = false"
          ></f7-list-input>

          <f7-list-input
            label="Consecutivo"
            type="number"
            error-message="Campo obligatorio"
            required
            clear-button
            v-model:value="form.agencia.consecutivo"
            :error-message-force="errores.agencia.consecutivo"
            @input="errores.agencia.consecutivo = false"
          ></f7-list-input>

          <f7-block strong>
            <f7-row>
              <f7-col width="100%">
                <f7-button
                  color="teal"
                  class="width-100"
                  large
                  outline
                  @click="validate_form"
                  >Guardar</f7-button
                >
              </f7-col>
            </f7-row>
          </f7-block>
        </f7-list>
      </f7-card>
    </f7-page>
  </f7-popup>
</template>

<script>
import { mapGetters } from "vuex";
import { loader, toast } from "../../js/utils/plugins";
import _ from "lodash";
export default {
  props: {
    estado: Boolean,
  },
  data() {
    return {
      form: {
        state_network: true,
        prefijo: "REMI",
        numero: null,
        ubicacion: {
          codigo: null,
          nombre: null,
        },
        agencia: {
          codigo: null,
          nombre: null,
          consecutivo: null,
        },
      },
      errores: {
        prefijo: false,
        numero: false,
        ubicacion: {
          codigo: false,
          nombre: false,
        },
        agencia: {
          codigo: false,
          nombre: false,
          consecutivo: false,
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      data_config: "user/get_data_config",
      setting: "setting/get_data",
      agencies: "agencies/get_list",
    }),
  },
  watch: {
    data_config: function (val) {
      this.form = { ...val };
    },
    setting: function (val) {
      let { form } = this;

      let agencie = this.agencies.find(
        (e) => e.codigo_agc == val.ptoperfil_empr
      );

      form.ubicacion.codigo = val.ubicaperfil_empr;
      form.agencia.codigo = val.ptoperfil_empr;
      form.agencia.nombre = agencie?.descripcion_agc || "";
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
      else if (!form.ubicacion.codigo) errores.ubicacion.codigo = true;
      else if (!form.ubicacion.nombre) errores.ubicacion.nombre = true;
      else if (!form.agencia.codigo) errores.agencia.codigo = true;
      else if (!form.agencia.nombre) errores.agencia.nombre = true;
      else if (!form.agencia.consecutivo) errores.agencia.consecutivo = true;
      else {
        let dispatch = this.$store.dispatch;

        try {
          let loader_src = loader(true);
          loader_src.setTitle(`Guardando configuracion...`);

          await dispatch("user/save_config", [_.cloneDeep(form)]);
          // await dispatch("setting/state_network", { state_network });

          loader(false);
          toast("Proceso terminado correctamente");
          this.close();
          setTimeout(() => {
            location.reload();
          }, 500);
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