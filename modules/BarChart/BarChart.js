// Eg at http://c3js.org/samples/chart_bar.html
export default class BarChart {

  constructor(container_id, x_name, y_name, y_categories, columns, colors) {
    this.chart = c3.generate({
      bindto: '#' + container_id,
      data: {
        columns: columns,
        type: "bar",
        colors: colors
      },
      legend: {
        show: false
      },
      tooltip: {
        show: false
      },
      interaction: {
        enabled: false
      },
      axis: {
        x: {
          label: x_name,
          type: 'category',
          categories: y_categories
        },
        y: {
          label: y_name
        },
      }
    });
  }

  update(categories, columns) {
    this.chart.load({
      columns: columns,
      categories : categories
    });
  }

  showOnly(column_name) {
    this.chart.hide();
    this.chart.show(column_name);
  }

}
