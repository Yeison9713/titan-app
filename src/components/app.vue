<template>
  <f7-app v-bind="f7params">
    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" url="/"></f7-view>
  </f7-app>
</template>
<script>
import { onMounted } from "vue";
import { f7, f7ready } from "framework7-vue";

import { getDevice } from "framework7/lite-bundle";
import capacitorApp from "../js/capacitor-app.js";
import routes from "../js/routes.js";

export default {
  setup() {
    const device = getDevice();
    // Framework7 Parameters
    const f7params = {
      name: "titan-app", // App name
      theme: "auto", // Automatic theme detection

      id: "io.framework7.myapp", // App bundle ID

      // App routes
      routes,

      // Input settings
      input: {
        scrollIntoViewOnFocus: device.capacitor,
        scrollIntoViewCentered: device.capacitor,
      },
      // Capacitor Statusbar settings
      statusbar: {
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
      },
    };

    onMounted(() => {
      f7ready(() => {
        // Init capacitor APIs (see capacitor-app.js)
        if (device.capacitor) {
          capacitorApp.init(f7);
        }
        // Call F7 APIs here
      });
    });

    return {
      f7params,
    };
  },
};
</script>