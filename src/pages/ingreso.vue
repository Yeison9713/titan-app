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
            <img :src="logo" />
            <span
              :style="{ 'text-transform': 'uppercase', 'font-weight': '500' }"
            >
              Titan app
            </span>
          </f7-list-item>

          <f7-list-input
            label="Empresa"
            type="text"
            floating-label
            error-message="Campo obligatorio"
            clear-button
            outline
          >
          </f7-list-input>

          <f7-list-input
            label="Usuario"
            type="text"
            floating-label
            error-message="Campo obligatorio"
            clear-button
            outline
            class="input-login"
          >
          </f7-list-input>

          <f7-list-item-row class="display-block input-login-password">
            <f7-row no-gap>
              <f7-col width="90">
                <f7-list-input
                  label="Contraseña"
                  :type="show_pass ? 'text' : 'password'"
                  floating-label
                  v-model:value="form.clave"
                  error-message="Campo obligatorio"
                  clear-button
                  outline
                  class="input-login"
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
            v-model:checked="recordar_cuenta"
          ></f7-list-item>

          <f7-list-item>
            <f7-button
              large
              fill
              :style="{
                width: '100%',
              }"
              href="/usuario/"
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
import { f7 } from "framework7-vue";
import logo from "../assets/logo.png";

export default {
  data() {
    return {
      logo,
      show_pass: false,
      recordar_cuenta: false,
      form: {},
      info_app: {},
    };
  },

  async created() {
    if (window.Capacitor || f7.device.electron) {
      this.info_app = await window.Capacitor.Plugins.App.getInfo();
      console.log("[APP INFO]", this.info_app);
    }
  },

  methods: {},
};
</script>

<style lang="sass">
.page-current
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

  .item-content
    padding: 0

  img
    max-width: 80%
    max-height: 80%
    margin: 5px 0 10px 0

.input-login > .item-content > .item-media
  padding: 3px 0 0 0 !important
  align-self: center
  min-width: 0

.input-login-password
  padding-right: calc( var(--f7-list-item-padding-horizontal) + var(--f7-safe-area-right) - var(--menu-list-offset) )
</style>