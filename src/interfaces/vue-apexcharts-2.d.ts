import ApexCharts from "apexcharts";

declare module "vue/types/vue" {
  interface Vue {
    $apexcharts: typeof ApexCharts;
  }
}
