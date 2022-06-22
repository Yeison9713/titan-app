<template>
  <f7-popup
    class="config_rut"
    v-model:opened="estado"
    @popup:opened="open"
    @popup:closed="closed"
  >
    <f7-view>
      <f7-page>
        <f7-navbar
          :title="
            procedure == 'update' ? 'Actualizar RUT' : `Agregar nuevo RUT`
          "
        >
          <f7-nav-right>
            <f7-link icon-f7="multiply" popup-close></f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-card>
          <f7-card-content class="padding-half">
            <f7-row>
              <f7-col width="100%">
                <f7-list>
                  <f7-list-item title="Información de usuario" group-title />
                </f7-list>
              </f7-col>
            </f7-row>

            <f7-row margin-bottom>
              <f7-col class="width-100">
                <f7-list :style="{ 'margin-top': '10px' }">
                  <f7-list-item
                    title="Tipo identificacion"
                    smart-select
                    :smart-select-params="{
                      closeOnSelect: true,
                      setValueText: false,
                    }"
                    :after="textValue('type_doc', form.tipoid_rut)"
                  >
                    <select name="type_id_doc" v-model="form.tipoid_rut">
                      <option
                        v-for="item in type_doc"
                        :key="item.value"
                        :value="item.value"
                      >
                        {{ item.text }}
                      </option>
                    </select>
                  </f7-list-item>
                </f7-list>
              </f7-col>
            </f7-row>

            <f7-row>
              <f7-col width="100%">
                <f7-list>
                  <f7-list-input
                    type="number"
                    outline
                    floating-label
                    label="Numero identificacion"
                    error-message="Campo obligatorio"
                    required
                    clear-button
                    v-model:value="form.identificacion_rut"
                    :error-message-force="errores.identificacion_rut"
                    @input="errores.identificacion_rut = false"
                  ></f7-list-input>
                </f7-list>
              </f7-col>
            </f7-row>

            <f7-row>
              <f7-col>
                <f7-list>
                  <f7-list-input
                    type="number"
                    outline
                    floating-label
                    label="Digito verificacion"
                    error-message="Campo obligatorio"
                    required
                    clear-button
                    v-model:value="form.dv_rut"
                    :error-message-force="errores.dv_rut"
                    @input="errores.dv_rut = false"
                  ></f7-list-input>
                </f7-list>
              </f7-col>
              <f7-col>
                <f7-list :style="{ 'margin-top': '10px' }">
                  <f7-list-item>
                    <f7-button fill color="lightblue" class="width-100">
                      <f7-icon
                        size="22"
                        f7="doc_text_search"
                        class="margin-left-half"
                        @click="make_dv"
                      ></f7-icon>
                    </f7-button>
                  </f7-list-item>
                </f7-list>
              </f7-col>
            </f7-row>

            <f7-row v-if="form.tipoid_rut != 31">
              <f7-col>
                <f7-list>
                  <f7-list-input
                    type="text"
                    outline
                    floating-label
                    label="Primer apellido"
                    error-message="Campo obligatorio"
                    required
                    clear-button
                    v-model:value="form.primerApellido_rut"
                    :error-message-force="errores.primerApellido_rut"
                    @input="errores.primerApellido_rut = false"
                  ></f7-list-input>
                </f7-list>
              </f7-col>
              <f7-col>
                <f7-list>
                  <f7-list-input
                    type="text"
                    outline
                    floating-label
                    label="segundo apellido"
                    error-message="Campo obligatorio"
                    required
                    clear-button
                    v-model:value="form.segundoApellido_rut"
                    :error-message-force="errores.segundoApellido_rut"
                    @input="errores.segundoApellido_rut = false"
                  ></f7-list-input>
                </f7-list>
              </f7-col>
            </f7-row>

            <f7-row v-if="form.tipoid_rut != 31">
              <f7-col>
                <f7-list>
                  <f7-list-input
                    type="text"
                    outline
                    floating-label
                    label="Nombres completos"
                    error-message="Campo obligatorio"
                    required
                    clear-button
                    v-model:value="form.nombres_rut"
                    :error-message-force="errores.nombres_rut"
                    @input="errores.nombres_rut = false"
                  ></f7-list-input>
                </f7-list>
              </f7-col>
            </f7-row>
            <f7-row v-if="form.tipoid_rut == 31">
              <f7-col>
                <f7-list>
                  <f7-list-input
                    type="text"
                    outline
                    floating-label
                    label="Razón social"
                    error-message="Campo obligatorio"
                    required
                    clear-button
                    v-model:value="form.descripcion_rut"
                    :error-message-force="errores.descripcion_rut"
                    @input="errores.descripcion_rut = false"
                  ></f7-list-input>
                </f7-list>
              </f7-col>
            </f7-row>

            <f7-row>
              <f7-col>
                <f7-list>
                  <f7-list-input
                    type="text"
                    outline
                    floating-label
                    label="Teléfono"
                    error-message="Campo obligatorio"
                    required
                    clear-button
                    v-model:value="form.telefono_rut"
                    :error-message-force="errores.telefono_rut"
                    @input="errores.telefono_rut = false"
                  ></f7-list-input>
                </f7-list>
              </f7-col>
              <f7-col>
                <f7-list>
                  <f7-list-input
                    type="text"
                    outline
                    floating-label
                    label="Teléfono alterno"
                    error-message="Campo obligatorio"
                    required
                    clear-button
                    v-model:value="form.telefonob_rut"
                    :error-message-force="errores.telefonob_rut"
                    @input="errores.telefonob_rut = false"
                  ></f7-list-input>
                </f7-list>
              </f7-col>
            </f7-row>

            <f7-row>
              <f7-col>
                <f7-list>
                  <f7-list-input
                    type="text"
                    outline
                    floating-label
                    label="Dirección"
                    error-message="Campo obligatorio"
                    required
                    clear-button
                    v-model:value="form.direccion_rut"
                    :error-message-force="errores.direccion_rut"
                    @input="errores.direccion_rut = false"
                  ></f7-list-input>
                </f7-list>
              </f7-col>
            </f7-row>

            <f7-row>
              <f7-col>
                <f7-list
                  :style="{ 'margin-top': '10px', 'margin-bottom': '10px' }"
                >
                  <f7-list-item
                    title="Departamento"
                    smart-select
                    :smart-select-params="{
                      closeOnSelect: true,
                      searchbar: true,
                      searchbarPlaceholder: 'Buscar departamento',
                      setValueText: false,
                    }"
                    :after="
                      textValue(
                        'department',
                        form.departamento_rut,
                        'codigo',
                        'departamento'
                      )
                    "
                  >
                    <select
                      name="departamento_rut"
                      v-model="form.departamento_rut"
                    >
                      <option
                        v-for="item in department"
                        :key="item.codigo"
                        :value="item.codigo"
                      >
                        {{ item.departamento }}
                      </option>
                    </select>
                  </f7-list-item>
                </f7-list>
              </f7-col>
              <f7-col>
                <f7-list
                  :style="{ 'margin-top': '10px', 'margin-bottom': '10px' }"
                >
                  <f7-list-item
                    title="Ciudad"
                    smart-select
                    :smart-select-params="{
                      closeOnSelect: true,
                      searchbar: true,
                      searchbarPlaceholder: 'Buscar ciudad',
                      setValueText: false,
                    }"
                    :after="
                      textValue(
                        'cities',
                        form.ciudad_rut,
                        'c_digo_dane_del_municipio',
                        'municipio'
                      )
                    "
                  >
                    <select name="ciudad_rut" v-model="form.ciudad_rut">
                      <option
                        v-for="item in cities"
                        :key="item.c_digo_dane_del_municipio"
                        :value="item.c_digo_dane_del_municipio"
                      >
                        {{ item.municipio }}
                      </option>
                    </select>
                  </f7-list-item>
                </f7-list>
              </f7-col>
            </f7-row>

            <f7-row>
              <f7-col>
                <f7-list>
                  <f7-list-input
                    type="text"
                    outline
                    floating-label
                    label="Correo 1"
                    error-message="Campo obligatorio"
                    required
                    clear-button
                    v-model:value="form.correo_rut"
                    :error-message-force="errores.correo_rut"
                    @input="errores.correo_rut = false"
                  ></f7-list-input>
                </f7-list>
              </f7-col>
            </f7-row>

            <f7-row>
              <f7-col>
                <f7-list>
                  <f7-list-input
                    type="text"
                    outline
                    floating-label
                    label="Correo 2"
                    error-message="Campo obligatorio"
                    required
                    clear-button
                    v-model:value="form.correo2_rut"
                    :error-message-force="errores.correo2_rut"
                    @input="errores.correo2_rut = false"
                  ></f7-list-input>
                </f7-list>
              </f7-col>
            </f7-row>

            <f7-row>
              <f7-col>
                <f7-list>
                  <f7-list-input
                    type="text"
                    outline
                    floating-label
                    label="Correo 3"
                    error-message="Campo obligatorio"
                    required
                    clear-button
                    v-model:value="form.correo3_rut"
                    :error-message-force="errores.correo3_rut"
                    @input="errores.correo3_rut = false"
                  ></f7-list-input>
                </f7-list>
              </f7-col>
            </f7-row>

            <f7-row>
              <f7-col width="100%">
                <f7-list>
                  <f7-list-item title="Información de contacto" group-title />
                </f7-list>
              </f7-col>
            </f7-row>

            <f7-row>
              <f7-col>
                <f7-list>
                  <f7-list-input
                    type="text"
                    outline
                    floating-label
                    label="Nombre"
                    error-message="Campo obligatorio"
                    required
                    clear-button
                    v-model:value="form.nombrecontac_rut"
                    :error-message-force="errores.nombrecontac_rut"
                    @input="errores.nombrecontac_rut = false"
                  ></f7-list-input>
                </f7-list>
              </f7-col>
            </f7-row>

            <f7-row>
              <f7-col>
                <f7-list>
                  <f7-list-input
                    type="text"
                    outline
                    floating-label
                    label="Teléfono"
                    error-message="Campo obligatorio"
                    required
                    clear-button
                    v-model:value="form.telecontacto_rut"
                    :error-message-force="errores.telecontacto_rut"
                    @input="errores.telecontacto_rut = false"
                  ></f7-list-input>
                </f7-list>
              </f7-col>
              <f7-col>
                <f7-list :style="{ 'margin-top': '10px' }">
                  <f7-list-item
                    title="Relacion comercial"
                    smart-select
                    :smart-select-params="{
                      closeOnSelect: true,
                      setValueText: false,
                    }"
                    :after="textValue('business_relation', form.relacion_rut)"
                  >
                    <select name="relacion_rut" v-model="form.relacion_rut">
                      <option
                        v-for="item in business_relation"
                        :key="item.value"
                        :value="item.value"
                      >
                        {{ item.text }}
                      </option>
                    </select>
                  </f7-list-item>
                </f7-list>
              </f7-col>
            </f7-row>

            <f7-row>
              <f7-col>
                <f7-list
                  :style="{ 'margin-top': '10px', 'margin-bottom': '10px' }"
                >
                  <f7-list-item
                    title="Otra relacion"
                    smart-select
                    :smart-select-params="{
                      closeOnSelect: true,
                      setValueText: false,
                    }"
                    :after="textValue('business_relation', form.relacion2_rut)"
                  >
                    <select name="relacion2_rut" v-model="form.relacion2_rut">
                      <option
                        v-for="item in business_relation"
                        :key="item.value"
                        :value="item.value"
                      >
                        {{ item.text }}
                      </option>
                    </select>
                  </f7-list-item>
                </f7-list>
              </f7-col>
              <f7-col>
                <f7-list
                  :style="{ 'margin-top': '10px', 'margin-bottom': '10px' }"
                >
                  <f7-list-item
                    title="Estado"
                    smart-select
                    :smart-select-params="{
                      closeOnSelect: true,
                      setValueText: false,
                    }"
                    :after="textValue('status', form.estado_rut)"
                  >
                    <select name="estado_rut" v-model="form.estado_rut">
                      <option
                        v-for="item in status"
                        :key="item.value"
                        :value="item.value"
                      >
                        {{ item.text }}
                      </option>
                    </select>
                  </f7-list-item>
                </f7-list>
              </f7-col>
            </f7-row>
          </f7-card-content>

          <f7-card-footer>
            <f7-list class="width-100" no-hairlines-between>
              <f7-list-item>
                <f7-button class="width-100" color="red" outline popup-close>
                  Cancelar
                </f7-button>
              </f7-list-item>

              <f7-list-item>
                <f7-button
                  class="width-100"
                  color="green"
                  outline
                  @click="save"
                >
                  {{ procedure == "update" ? "Actualizar RUT" : "Crear RUT" }}
                </f7-button>
              </f7-list-item>
            </f7-list>
          </f7-card-footer>
        </f7-card>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { check_dv, loader, toast } from "../../js/utils/plugins";

export default {
  props: {
    estado: Boolean,
    params: Object,
    procedure: String,
  },
  data() {
    return {
      form: {},
      errores: {
        tipoid_rut: false,
        identificacion_rut: false,
        dv_rut: false,
        primerApellido_rut: false,
        segundoApellido_rut: false,
        nombres_rut: false,
        descripcion_rut: false,
        telefono_rut: false,
        telefonob_rut: false,
        direccion_rut: false,

        ciudad_rut: false,
        departamento_rut: false,

        correo_rut: false,
        correo2_rut: false,
        correo3_rut: false,

        // contact
        nombrecontac_rut: false,
        telecontacto_rut: false,
        relacion_rut: false,
        relacion2_rut: false,
        estado_rut: false,
      },
      cities: [],
      status: [
        { value: 0, text: "Activo" },
        { value: 1, text: "Inactivo" },
      ],
    };
  },

  computed: {
    ...mapGetters({
      department: "cities/get_dep",
      type_doc: "customers/get_type_doc",
      business_relation: "customers/get_business_relation",
    }),
  },

  watch: {
    "form.departamento_rut": async function (val) {
      this.cities = await this.filter_cities(val);
    },
  },

  methods: {
    ...mapActions({
      filter_cities: "cities/filter_cities",
      update_customer: "customers/update",
      create_customer: "customers/create",
    }),

    textValue(obj, id, field = "value", resolve = "text") {
      let retornar = this[obj]?.find((e) => e[field] == id);

      if (!retornar || retornar?.text) return retornar?.text || "";
      else return retornar[resolve] || "";
    },

    async open() {
      this.init_form();
      let dispatch = this.$store.dispatch;

      await dispatch("cities/query_list");

      let data = this.params;

      if (data.identificacion_rut) {
        let { form } = this;

        Object.keys(data).forEach((item) => {
          if (item in form) {
            form[item] = data[item];
          }
        });

        form.tipoid_rut = parseFloat(data.tipoid_rut);

        form.identificacion_rut = parseFloat(data.identificacion_rut);
        form.dv_rut = parseFloat(data.dv_rut);
        form.departamento_rut = data.ciudad_rut.substr(0, 2);

        form.relacion_rut = parseFloat(form.relacion_rut);
        form.relacion2_rut = parseFloat(form.relacion2_rut);
        form.estado_rut = parseFloat(form.estado_rut);
      }
    },

    async save() {
      try {
        let loader_src = loader(true);
        let form = this.form || {};
        let procedure = this.procedure;

        loader_src.setTitle(
          procedure == "update" ? "Actualizando RUT" : "Creando RUT"
        );

        if (procedure == "update") await this.update_customer(form);
        if (procedure == "create") await this.create_customer(form);

        setTimeout(() => {
          loader(false);
          toast("Proceso terminado correctamente");
          this.closed();
        }, 500);
      } catch (error) {
        loader(false);
        toast(error.msj || "Ha ocurrido un error procesando la información.");
        console.error("Error", error);
      }
    },

    init_form() {
      let form = {
        tipoid_rut: null,
        identificacion_rut: null,
        dv_rut: null,
        primerApellido_rut: null,
        segundoApellido_rut: null,
        nombres_rut: null,
        descripcion_rut: null,
        telefono_rut: null,
        telefonob_rut: null,
        direccion_rut: null,

        departamento_rut: null,
        ciudad_rut: null,

        correo_rut: null,
        correo2_rut: null,
        correo3_rut: null,

        // contact
        nombrecontac_rut: null,
        telecontacto_rut: null,
        relacion_rut: null,
        relacion2_rut: null,
        estado_rut: null,
      };

      this.form = { ...form };
    },

    make_dv() {
      this.form.dv_rut = check_dv(this.form.identificacion_rut);
    },

    closed() {
      this.init_form();
      this.$emit("closed", false);
    },
  },
};
</script>