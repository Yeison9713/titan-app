<template>
  <f7-page>
    <f7-navbar
      title="Remisión de Mercancías para Facturar"
      back-link="Back"
    ></f7-navbar>
    <f7-card
      :style="{
        padding: '10px',
      }"
    >
      <f7-list form class="form_factura">
        <f7-list-input
                label="punto de remision"
                type="select"
                floating-label
                outline
              >
                <option value="0">efectivo</option>
                <option value="1">tarjeta debito</option>
                <option value="2">tarjeta de credito</option>
                <option value="3">transferencia</option>
                <option value="4">anticipado</option>
                <option value="5">bono</option>
              </f7-list-input>
        <f7-list-item-row no-gap>
          <f7-row
            no-gap
            :style="{ width: '100%' }"
            class="display-flex justify-content-end"
          >
            <f7-col width="60">
              <f7-list-input label="Fecha" type="date" outline floating-label />
            </f7-col>
          </f7-row>
        </f7-list-item-row>
        <f7-list-item-row>
          <f7-row no-gap :style="{ width: '100%' }">
            <f7-col width="80">
              <f7-list-input
                label="Cliente"
                type="text"
                outline
                floating-label
                :value="cliente"
              />
            </f7-col>
            <f7-col
              width="20"
              :style="{ height: '100%' }"
              class="display-flex align-items-center padding-right"
              @click="
                cliente = 'Felipe';
                traer_productos();
              "
            >
              <f7-button fill color="green" :style="{ width: '100%' }">
                <f7-icon f7="search" size="22"></f7-icon>
              </f7-button>
            </f7-col>
          </f7-row>
        </f7-list-item-row>
        <f7-list-item>
          <div class="list accordion-opposite width-100">
            <ul class="no-padding-left">
              <li
                class="accordion-item swipeout"
                v-for="(item, index) in detalle"
                :key="index"
              >
                <a class="item-content item-link" href="#">
                  <div class="item-inner swipeout-content">
                    <f7-row
                      no-gap
                      class="width-100 display-flex align-items-center"
                    >
                      <f7-col width="70">
                        <div
                          class="item-title"
                          :style="{ 'font-size': '12px' }"
                        >
                          <b>{{ item.nombre }}</b>
                        </div>
                      </f7-col>
                      <f7-col
                        width="30"
                        class="text-align-right"
                        :style="{ 'font-size': '12px' }"
                      >
                        $ {{ item.valor }}
                      </f7-col>
                    </f7-row>
                  </div>
                  <div class="swipeout-actions-right">
                    <f7-link
                      icon-f7="multiply"
                      icon-color="white"
                      icon-size="24"
                      class="swipeout-red"
                    ></f7-link>
                  </div>
                </a>
                <div class="accordion-item-content">
                  <div class="block">
                    <f7-row>
                      <f7-col width="100">
                        <b>Cantidad:</b>
                        {{ item.cantidad }}
                      </f7-col>
                      <f7-col width="100">
                        <b>Ubicación:</b>
                        PRODUCTOS RUTA 1
                      </f7-col>
                    </f7-row>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </f7-list-item>
        <f7-list-item title="Cierre de remisión" group-title />
        <!-- cajitas.............................................. -->
        <f7-list-item-row>
          <f7-row no-gap :style="{ width: '100%' }">
            <f7-col width="50">
              <f7-list-input
                label="forma de pago"
                type="select"
                floating-label
                outline
              >
                <option value="0">contado</option>
                <option value="1">credito</option>
                <option value="2">anticipado</option>
              </f7-list-input>
            </f7-col>
            <f7-col width="50">
              <f7-list-input
                label="Medio de pago"
                type="select"
                floating-label
                outline
              >
                <option value="0">efectivo</option>
                <option value="1">tarjeta debito</option>
                <option value="2">tarjeta de credito</option>
                <option value="3">transferencia</option>
                <option value="4">anticipado</option>
                <option value="5">bono</option>
              </f7-list-input>
            </f7-col>
          </f7-row>
        </f7-list-item-row>
        <f7-list-input
          label="observaciones"
          type="textarea"
          floating-label
          outline
        />

        <f7-block strong>
          <f7-row>
            <f7-col>
              <f7-button fill color="green">subir </f7-button>
            </f7-col>
            <f7-col>
              <f7-button fill color="gray">imprimir </f7-button>
            </f7-col>
            <f7-col>
              <f7-button fill color="orange">compartir </f7-button>
            </f7-col>
          </f7-row>
        </f7-block>
      </f7-list>
    </f7-card>
  </f7-page>
</template>