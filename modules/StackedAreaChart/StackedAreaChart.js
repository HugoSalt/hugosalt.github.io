// Eg at http://c3js.org/samples/chart_area_stacked.html
export default class StackedAreaChart {

  constructor(container_id, x_name,y_name, columns, types, groups, colors, order_stack) {
    var chart = c3.generate({
      bindto: '#' + container_id,
      data: {
        x: x_name,
        columns: columns,
        types: types,
        groups: groups,
        colors: colors,
        order: function(t1, t2) {
          return order_stack[t1.id] < order_stack[t2.id];
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
          label: y_name
        },
      }
    });
  }

}
