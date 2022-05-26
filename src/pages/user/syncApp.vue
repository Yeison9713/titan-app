<template>
  <f7-page class="main-titan">
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
              <f7-list-input
                label="Empresa"
                type="text"
                floating-label
                error-message="Campo obligatorio"
                clear-button
                outline
              >
                <!-- <template v-slot:media>
                  <f7-link icon-material="business" icon-size="24"></f7-link>
                </template> -->
              </f7-list-input>
            </f7-list>
          </f7-col>
        </f7-row>
        <f7-row>
          <f7-col>
            <f7-list>
              <f7-list-item>
                <f7-button
                  fill
                  outlined
                  :style="{
                    width: '100%',
                  }"
                >
                  Consultar
                </f7-button>
              </f7-list-item>
            </f7-list>
          </f7-col>
        </f7-row>
      </f7-card-content>
    </f7-card>

    <f7-card>
      <f7-card-content class="padding-half"> listado </f7-card-content>
    </f7-card>
  </f7-page>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>