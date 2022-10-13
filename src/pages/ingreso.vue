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
                backgroundImage: `url(${logo})`,
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
            v-model:checked="recordar_cuenta"
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
import { f7 } from "framework7-vue";
import { request_titan } from "../js/utils/request_titan";
import { mapGetters, mapActions } from "vuex";

import { loader, toast } from "../js/utils/plugins";

export default {
  data() {
    return {
      logo: null,
      show_pass: false,
      recordar_cuenta: false,
      form: {
        company: null,
        user: null,
        password: null,
      },
      errores: {
        company: false,
        user: false,
        password: false,
      },
      info_app: {},
    };
  },

  async created() {
    if (window.Capacitor || f7.device.electron) {
      this.info_app = await window.Capacitor.Plugins.App.getInfo();
      console.log("[APP INFO]", this.info_app);
    }

    let dispatch = this.$store.dispatch;

    await dispatch("setting/query_data");
  },

  computed: {
    ...mapGetters({
      ip_service: "setting/get_service",
      get_url: "setting/get_url",
      setting: "setting/get_data",
    }),
  },

  watch: {
    setting: function (val) {
      let nit = parseFloat(val?.id_empr) || 0;
      this.logo = `https://www.titansoluciones.net/img/${nit}.png`;
    },
  },

  methods: {
    ...mapActions({
      save_user: "user/login",
    }),

    validate_login() {
      let { form, errores } = this;

      if (!form.company) errores.company = true;
      else if (!form.user) errores.user = true;
      else if (!form.password) errores.password = true;
      else {
        loader(true);

        let data = {
          data: {
            importarhtml: `${form.company}|${form.user}|${form.password}|0|`,
          },

          url: this.get_url("login"),
        };

        request_titan({ url: this.ip_service, data })
          .then((res) => {
            let { message } = res;

            message.push(form.company);
            message.push(form.user);
            message.push(form.password);

            this.save_user({ data: message, remember_account: this.recordar_cuenta });

            loader(false);
          })
          .catch((error) => {
            loader(false);
            toast(error?.message[0] || error);
          });
      }
    },
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