// Eg at http://c3js.org/samples/chart_bar_stacked.html
export default class StackedAreaChart {

  constructor(container_id, x_name, y_name, y_categories, columns, groups) {
    this.chart = c3.generate({
      bindto: '#' + container_id,
      data: {
        columns: columns,
        type: "bar",
        groups: groups
      },
      tooltip: {
        show: false
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

  update(columns) {
    this.chart.load({
      columns: columns
    });
  }

  showOnly(column_name) {
    this.chart.hide();
    this.chart.show(column_name);
  }

}
