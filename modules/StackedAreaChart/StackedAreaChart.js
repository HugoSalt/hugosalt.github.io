// Eg at http://c3js.org/samples/chart_area_stacked.html
export default class StackedAreaChart {

  constructor(container_id, x_name, y_name, y_max, columns, types, groups, colors, order_stack) {
    document.getElementById(container_id).style.transition = "all 0.5s ease-in-out";
    this.chart = c3.generate({
      bindto: '#' + container_id,
      data: {
        x: x_name,
        columns: columns,
        types: types,
        groups: groups,
        colors: colors,
        order: function(t1, t2) {
          return order_stack[t1.id] < order_stack[t2.id]  ? 1 : -1;
        }
      },
      tooltip: {
        show: false
      },
      axis: {
        x: {
          label: x_name
        },
        y: {
          label: y_name,
          max: y_max
        },
      }
    });
  }

  update(columns) {
    this.chart.load({
      columns: columns
    });
  }

  update_full(container_id, x_name, y_name, y_max, columns, types, groups, colors, order_stack) {
    let container = document.getElementById(container_id);
    container.style.opacity = "0.0";
    setTimeout(() => {
      this.chart.destroy();
      this.chart = c3.generate({
        bindto: '#' + container_id,
        data: {
          x: x_name,
          columns: columns,
          types: types,
          groups: groups
          // colors: colors,
          //order: function(t1, t2) {
          //  return order_stack[t1.id] < order_stack[t2.id]  ? 1 : -1;
          //}
        },
        tooltip: {
          show: false
        },
        axis: {
          x: {
            label: x_name
          },
          y: {
            label: y_name,
            max: y_max
          },
        }
      });
    }, 500);
    setTimeout(() => {
      container.style.opacity = "1.0";
    }, 510);
  }

}
