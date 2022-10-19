<template>
  <f7-page name="ingreso" style="background: #fff">
    <f7-row
      :style="{ height: '100%' }"
      class="display-flex align-items-center justify-content-space-around"
    >
      <f7-col :style="{ 'border-radius': '5px', background: '#fff' }">
        <f7-list
          class="width-100"
          inset
          no-hairlines
          no-hairlines-between
          :style="{ margin: '11px 0 5px 0' }"
        >
          <f7-list-item id="logo">
            <div
              :style="{
                backgroundImage: `url(${form.logo})`,
                backgroundSize: '90%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }"
            ></div>
          </f7-list-item>

          <f7-list-item class="display-flex justify-content-center">
            <span
              :style="{ 'text-transform': 'uppercase', 'font-weight': '500' }"
            >
              Titan remisiones
            </span>
          </f7-list-item>

          <f7-list-input
            label="Empresa"
            type="text"
            floating-label
            error-message="Campo obligatorio"
            required
            clear-button
            outline
            v-model:value="form.company"
            :error-message-force="errores.company"
            @input="errores.company = false"
            autofocus
          >
          </f7-list-input>

          <f7-list-input
            label="Usuario"
            type="text"
            floating-label
            error-message="Campo obligatorio"
            required
            clear-button
            outline
            v-model:value="form.user"
            :error-message-force="errores.user"
            @input="errores.user = false"
          >
          </f7-list-input>

          <f7-list-item-row class="display-block input-login-password">
            <f7-row no-gap>
              <f7-col width="90">
                <f7-list-input
                  label="Contraseña"
                  :type="show_pass ? 'text' : 'password'"
                  floating-label
                  error-message="Campo obligatorio"
                  required
                  clear-button
                  outline
                  class="input-login"
                  v-model:value="form.password"
                  :error-message-force="errores.password"
                  @input="errores.password = false"
                >
                </f7-list-input>
              </f7-col>
              <f7-col
                width="10"
                class="align-self-center text-align-right"
                :style="{ 'margin-top': '10px' }"
              >
                <f7-link
                  :icon-material="show_pass ? 'visibility' : 'visibility_off'"
                  icon-size="24"
                  :icon-color="show_pass ? 'dark-blue' : 'gray'"
                  @click="show_pass = !show_pass"
                ></f7-link>
              </f7-col>
            </f7-row>
          </f7-list-item-row>

          <f7-list-item
            checkbox
            title="Recordar cuenta"
            name="demo-checkbox"
            v-model:checked="form.remember_account"
          ></f7-list-item>

          <f7-list-item>
            <f7-button
              large
              fill
              :style="{
                width: '100%',
              }"
              @click="validate_login"
            >
              Ingresar
            </f7-button>
          </f7-list-item>

          <f7-list-item
            class="display-flex align-items-center justify-content-center"
          >
            <span
              :style="{
                'font-weight': '400',
                'font-size': ' 12px',
                color: '#CCC',
              }"
              class="text-align-center"
            >
              Titansoluciones • 2022
              <br />
              V.
              {{
                info_app.version
                  ? info_app.version + " - " + info_app.build
                  : "WEB"
              }}
            </span>
          </f7-list-item>
        </f7-list>
      </f7-col>
    </f7-row>
  </f7-page>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from "vue";

import { f7 } from "framework7-vue";
import { useStore } from "vuex";
import { loader, toast } from "../js/utils/plugins";

export default {
  setup() {
    const store = useStore();
    const show_pass = ref(false);

    const form = reactive({
      logo: null,
      company: null,
      user: null,
      password: null,
      remember_account: false,
    });

    const errores = reactive({
      company: false,
      user: false,
      password: false,
    });

    const info_app = reactive({
      id: null,
      name: null,
      build: null,
      version: null,
    });

    watch(
      () => store.getters["setting/get_data"],
      (val) => {
        let nit = parseFloat(val?.id_empr) || 0;
        form.logo = `https://www.titansoluciones.net/img/${nit}.png`;
        form.company = nit;
      },
      { deep: true }
    );

    const validate_login = () => {
      if (!form.company) errores.company = true;
      else if (!form.user) errores.user = true;
      else if (!form.password) errores.password = true;
      else {
        loader(true);

        store
          .dispatch("middleware/login", { ...form })
          .then((res) => {
            location.reload();
          })
          .catch((error) => {
            console.log(error)
            loader(false);
            toast(error?.message[0] || error);
          });
      }
    };

    onMounted(async () => {
      store.dispatch("setting/query_data");

      if (window.Capacitor || f7.device.electron) {
        let info = await window.Capacitor.Plugins.App.getInfo();
        info_app.id = info.id;
        info_app.name = info.name;
        info_app.build = info.build;
        info_app.version = info.version;

        console.log("[APP INFO]", info_app);
      }
    });

    return {
      show_pass,
      form,
      errores,
      info_app,
      validate_login,
    };
  },
};
</script>

<style lang="sass">
[data-name=ingreso].page-current
  display: flex
  justify-content: center

  .page-content
    width: 90%

#logo
  display: flex
  justify-content: space-around
  align-items: center

  .item-inner
    flex-direction: column
    padding: 0

  div
    width: 100px
    height: 100px

  .item-content
    padding: 0

.input-login > .item-content > .item-media
  padding: 3px 0 0 0 !important
  align-self: center
  min-width: 0

.input-login-password
  padding-right: calc( var(--f7-list-item-padding-horizontal) + var(--f7-safe-area-right) - var(--menu-list-offset) )
</style>